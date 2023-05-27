using FadeCinema.Domain;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Responses
{
    public class MovieReviewResponse
    {
        public string Id { get; set; }
        public string MovieId { get; set; }
        public string AuthorId { get; set; }
        [JsonPropertyName("user")]
        public UserResponse User { get; set; }
        public int Rating { get; set; }
        public string Description { get; set; }
        public Movie Movie { get; set; }
        public DateTime CreatedAt { get; set; }
        public IEnumerable<string> ErrorMessages { get; set; }
    }

    public static class MovieReviewExtensions
    {
        public static MovieReviewResponse ToResponse(this MovieReview movieReview)
        {
            return new MovieReviewResponse
            {
                Id = movieReview.Id,
                AuthorId = movieReview.AuthorId,
                User = movieReview.User.ToResponse(),
                Rating = movieReview.Rating,
                MovieId = movieReview.MovieId,
                Description = movieReview.Description,
                CreatedAt = movieReview.CreatedAt,
                Movie = movieReview.Movie,
            };

        }
    }
}

