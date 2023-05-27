using FadeCinema.Data;
using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static FadeCinema.Routes.V1.ApiRoutes;

namespace FadeCinema.Services
{
    public class MovieService : IMovieService
    {
        private ApplicationDbContext _dbContext;

        private readonly IBlobStorageService _blobStorageService;
        private readonly string _connectionString;
        private readonly string _containerName;
        public MovieService(ApplicationDbContext dbContext, IBlobStorageService blobStorageService, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _blobStorageService = blobStorageService;
            var blobStorageSettingsSection = configuration.GetSection("BlobStorageSettings");
            var blobStorageSettings = blobStorageSettingsSection.Get<BlobStorageSettings>();

            _connectionString = blobStorageSettings.ConnectionString;
            _containerName = blobStorageSettings.ContainerName;
        }
        public async Task<Movie> GetMovieById(string movieId)
        {
            var movie = await _dbContext.Movies
                .Include(movie => movie.User)
                .FirstOrDefaultAsync(movie => movie.Id == movieId);

            return movie;
        }
        public async Task<(List<Movie>, bool)> GetMovies(int page)
        {
            const int pageSize = 20;
            var movies = await _dbContext.Movies
                .Skip(page * pageSize)
                .Take(pageSize)
                .Include(movie => movie.User)
                .OrderBy(movie => movie.Name)
                .ToListAsync();
            var hasMore = await _dbContext.Cinemas.Skip((page + 1) * pageSize).AnyAsync();

            return (movies, hasMore);
        }
        public async Task<(List<Movie>, bool)> GetMoviesByContainingString(int page, string value)
        {
            const int pageSize = 20;
            var movies = await _dbContext.Movies
                .Skip(page * pageSize)
                .Take(pageSize)
                .Include(movie => movie.User)
                .Where(movie => movie.Name.ToLower().Contains(value.ToLower()))
                .OrderBy(movie => movie.Name)
                .ToListAsync();
            var hasMore = await _dbContext.Movies.Skip((page + 1) * pageSize).AnyAsync();

            return (movies, hasMore);
        }
        public async Task<Movie> CreateMovie(Movie movie, string userId)
        {
            movie.AuthorId = userId;
            movie.User = await _dbContext.Users.FindAsync(userId);
            var entity = _dbContext.Add(movie).Entity;
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<Movie> UpdateMovie(string movieId, Movie movie)
        {
            var entity = await GetMovieById(movieId);
            _dbContext.Entry(entity).State = EntityState.Detached;

            movie.Id = entity.Id;
            movie.User = entity.User;
            movie.CreatedAt = entity.CreatedAt;
            movie.UpdatedAt = DateTime.Now;
            entity = _dbContext.Movies.Update(movie).Entity;
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<MovieResponse> DeleteMovie(string movieId)
        {
            var screeningEntities = await _dbContext.Screenings
               .Where(screening => screening.MovieId == movieId)
               .Include(screening => screening.User)
               .Include(screening => screening.Movie)
               .Include(screening => screening.Auditorium)
               .Include(screening => screening.Auditorium.Cinema)
               .Include(screening => screening.TicketCategory).ToListAsync();

            if (screeningEntities.Count != 0)
            {
                return (new MovieResponse
                {
                    ErrorMessages = new[] { "There is a screening that currently uses this movie." },
                });
            }

            var movie = await GetMovieById(movieId);
            var screenings = await _dbContext.Screenings.Where(screening => screening.MovieId == movieId).ToListAsync();
            var seats = await _dbContext.ScreeningSeats
                .Where(seat => screenings
                .Select(screening => screening.Id)
                .Contains(seat.ScreeningId)).ToListAsync();

            var movieReviews = await _dbContext.MovieReviews
                .Where(movieReview => movieReview.MovieId == movie.Id)
                .ToListAsync();

            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var movieReviewHistory = new List<MovieReviewHistory>();

                    foreach (MovieReview movieReview in movieReviews)
                    {
                        movieReviewHistory.Add(new MovieReviewHistory
                        {
                            AuthorId = movieReview.AuthorId,
                            MovieName = movie.Name,
                            Description = movieReview.Description,
                            Rating = movieReview.Rating,
                            PublishedAt = movieReview.CreatedAt,
                        });
                    }

                    _dbContext.BulkInsert(movieReviewHistory);
                    _dbContext.BulkDelete(movieReviews);
                    await _dbContext.BulkDeleteAsync(seats);
                    await _dbContext.BulkDeleteAsync(screenings);
                    await _blobStorageService.DeleteBlobs(_connectionString, _containerName, movieId, "/images/movies");
                    _dbContext.Remove(movie);
                    await _dbContext.BulkSaveChangesAsync();
                    transaction.Commit();
                }

                catch (Exception e)
                {
                    transaction.Rollback();
                }
            }

            return movie.ToResponse();
        }
    }
}
