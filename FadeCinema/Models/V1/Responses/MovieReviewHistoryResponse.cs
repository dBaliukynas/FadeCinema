using FadeCinema.Domain;
using System;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Responses
{
    public class MovieReviewHistoryResponse
    {
        public string Id { get; set; }
        [JsonPropertyName("authorId")]
        public string AuthorId { get; set; }
        public UserResponse User { get; set; }
        [JsonPropertyName("movieName")]
        public string MovieName { get; set; }
        public string Description { get; set; }
        public int Rating { get; set; }
        [JsonPropertyName("publishedAt")]
        public DateTime PublishedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public static class MovieReviewHistoryResponseExtensions
    {
        public static MovieReviewHistoryResponse ToResponse(this MovieReviewHistory movieReviewTicketHistory)
        {
            return new MovieReviewHistoryResponse
            {
                Id = movieReviewTicketHistory.Id,
                AuthorId = movieReviewTicketHistory.AuthorId,
                MovieName = movieReviewTicketHistory.MovieName,
                Description = movieReviewTicketHistory.Description,
                Rating = movieReviewTicketHistory.Rating,
                PublishedAt = movieReviewTicketHistory.PublishedAt,
                User = movieReviewTicketHistory.User.ToResponse(),
                CreatedAt = movieReviewTicketHistory.CreatedAt,
            };

        }
    }
}

