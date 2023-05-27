using FadeCinema.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;
using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace FadeCinema.Models.V1.Responses
{
    public class CinemaResponse
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public UserResponse User { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("location")]
        public Location Location { get; set; }
        public IEnumerable<string> ErrorMessages { get; set; }
    }

    public class Location
    {
        [JsonPropertyName("address")]
        public string Address { get; set; }
        [JsonPropertyName("country")]
        public string Country { get; set; }
        [JsonPropertyName("state")]
        public string State { get; set; }
        [JsonPropertyName("city")]
        public string City { get; set; }
        [JsonPropertyName("district")]
        public string District { get; set; }
        [JsonPropertyName("zipCode")]
        public string ZipCode { get; set; }
        [JsonPropertyName("longitude")]
        public double? Longitude { get; set; }
        [JsonPropertyName("latitude")]
        public double? Latitude { get; set; }
    }

    public static class CinemaExtensions
    {
        public static CinemaResponse ToResponse(this Cinema cinema)
        {
            var location = new Location { 
                Address = cinema.Address, 
                Country = cinema.Country,
                State = cinema.State,
                City = cinema.City,
                District = cinema.District,
                ZipCode = cinema.ZipCode,
                Longitude = cinema.Longitude,
                Latitude = cinema.Latitude,
            };
            return new CinemaResponse
            {
                Id = cinema.Id,
                AuthorId = cinema.AuthorId,
                User = cinema.User.ToResponse(),
                Name = cinema.Name,
                Description = cinema.Description,
                Location = location,
            };

        }
    }
}
