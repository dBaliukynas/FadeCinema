using FadeCinema.Domain;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using static FadeCinema.Routes.V1.ApiRoutes;

namespace FadeCinema.Models.V1.Responses
{
    public class MovieResponse
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public UserResponse User { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("country")]
        public string Country { get; set; }
        public string Director { get; set; }
        public double? Duration { get; set; }
        public IEnumerable<string> ErrorMessages { get; set; }
    }

    public static class MovieExtensions
    {
        public static MovieResponse ToResponse(this Movie movie)
        {
            return new MovieResponse
            {
                Id = movie.Id,
                AuthorId = movie.AuthorId,
                Name = movie.Name,
                User = movie.User.ToResponse(),
                Description = movie.Description,
                Country = movie.Country,
                Director = movie.Director,
                Duration = movie.Duration,
            };

        }
    }
}
