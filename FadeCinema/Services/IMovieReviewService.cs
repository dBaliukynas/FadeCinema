using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FadeCinema.Services
{
    public interface IMovieReviewService
    {
        public Task<MovieReview> GetMovieReviewById(string movieReviewId);
        public Task<(List<MovieReview>, bool)> GetMovieReviewsByMovieId(string movieId, int page, string userId);
        public Task<(List<MovieReview>, bool)> GetMovieReviewsByUserId(int page, string userId);
        public Task<(List<MovieReviewHistory>, bool)> GetMovieReviewHistory(int page, string userId);
        public Task<MovieReview> CreateMovieReview(MovieReview movieReview, string movieId, string userId);
        public Task<MovieReview> UpdateMovieReview(string movieReviewId, MovieReview movieReview);
        public Task<MovieReview> DeleteMovieReview(string movieReviewId);
    }
}
