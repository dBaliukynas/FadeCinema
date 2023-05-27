using FadeCinema.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Requests
{
    public class MovieRequest
    {
        public Movie ToDomain()
        {
            return new Movie
            {
                Name = Name,
                Description = Description,
                Country = Country,
                Director = Director,
                Duration = Duration,
            };
        }
        [JsonPropertyName("name")]
        [Required(ErrorMessage = "Movie's name cannot be empty.")]
        [StringLength(100, ErrorMessage = "Movie's name cannot be longer than 100 characters.")]
        public string Name { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        public double? Duration { get; set; }
        public string Director { get; set; }
        [Required(ErrorMessage = "Movie's country cannot be empty.")]
        [JsonPropertyName("country")]
        public string Country { get; set; }
    }
}
