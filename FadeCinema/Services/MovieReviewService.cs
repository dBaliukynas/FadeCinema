using FadeCinema.Data;
using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static FadeCinema.Routes.V1.ApiRoutes;

namespace FadeCinema.Services
{
    public class MovieReviewService : IMovieReviewService
    {
        private ApplicationDbContext _dbContext;
        public MovieReviewService(ApplicationDbContext dbContext, IScreeningService screeningService)
        {
            _dbContext = dbContext;
        }

        public async Task<MovieReview> GetMovieReviewById(string movieReviewId)
        {
            var movieReview = await _dbContext.MovieReviews
                .Include(movieReview => movieReview.User)
                .Include(movieReview => movieReview.Movie)
                .FirstOrDefaultAsync(movieReview => movieReview.Id == movieReviewId);

            return movieReview;
        }

        public async Task<(List<MovieReview>, bool)> GetMovieReviewsByMovieId(string movieId, int page, string userId)
        {
            var pageSize = 20;
            var movieReviews = await _dbContext.MovieReviews
                .Skip(page * pageSize)
                .Take(pageSize)
                .Where(movieReview => movieReview.MovieId == movieId)
                .OrderByDescending(movieReview => movieReview.User.Id == userId)
                .ThenByDescending(movieReview => movieReview.CreatedAt)
                .Include(movieReview => movieReview.User)
                .Include(movieReview => movieReview.Movie)
                .ToListAsync();
            var hasMore = await _dbContext.MovieReviews.Skip((page + 1) * pageSize).AnyAsync();

            return (movieReviews, hasMore);
        }

        public async Task<(List<MovieReview>, bool)> GetMovieReviewsByUserId(int page, string userId)
        {
            var pageSize = 20;
            var movieReviews = await _dbContext.MovieReviews
                .Skip(page * pageSize)
                .Take(pageSize)
                .Where(movieReview => movieReview.AuthorId == userId)
                .OrderByDescending(movieReview => movieReview.CreatedAt)
                .Include(movieReview => movieReview.User)
                .Include(movieReview => movieReview.Movie)
                .ToListAsync();
            var hasMore = await _dbContext.MovieReviews.Skip((page + 1) * pageSize).AnyAsync();

            return (movieReviews, hasMore);
        }
        public async Task<(List<MovieReviewHistory>, bool)> GetMovieReviewHistory(int page, string userId)
        {
            var pageSize = 20;

            var purchasedTicketHistory = await _dbContext.MovieReviewHistory
                .Skip(page * pageSize)
                .Take(pageSize)
                .Include(movieReview => movieReview.User)
                .Where(movieReview => movieReview.User.Id == userId)
                .ToListAsync();

            var hasMore = await _dbContext.MovieReviewHistory.Skip((page + 1) * pageSize).AnyAsync();

            return (purchasedTicketHistory, hasMore);

        }

        public async Task<MovieReview> CreateMovieReview(MovieReview movieReview, string movieId, string userId)
        {
            movieReview.AuthorId = userId;
            movieReview.MovieId = movieId;
            movieReview.User = await _dbContext.Users.FindAsync(userId);
            var entity = _dbContext.Add(movieReview).Entity;
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<MovieReview> UpdateMovieReview(string movieReviewId, MovieReview movieReview)
        {
            var entity = await GetMovieReviewById(movieReviewId);
            _dbContext.Entry(entity).State = EntityState.Detached;

            movieReview.Id = entity.Id;
            movieReview.User = entity.User;
            movieReview.CreatedAt = entity.CreatedAt;
            movieReview.MovieId = entity.MovieId;
            movieReview.UpdatedAt = DateTime.Now;
            entity = _dbContext.MovieReviews.Update(movieReview).Entity;
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<MovieReview> DeleteMovieReview(string movieReviewId)
        {
            var movieReview = await GetMovieReviewById(movieReviewId);

            var entity = _dbContext.Remove(movieReview).Entity;
            await _dbContext.BulkSaveChangesAsync();

            return entity;
        }
    }
}
