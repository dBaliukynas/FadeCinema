using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FadeCinema.Services
{
    public interface IMovieService
    {
        public Task<Movie> GetMovieById(string movieId);
        public Task<(List<Movie>, bool)> GetMovies(int page);
        public Task<(List<Movie>, bool)> GetMoviesByContainingString(int page, string value);
        public Task<Movie> CreateMovie(Movie movie, string userId);
        public Task<Movie> UpdateMovie(string movieId, Movie movie);
        public Task<MovieResponse> DeleteMovie(string movieId);
    }
}
