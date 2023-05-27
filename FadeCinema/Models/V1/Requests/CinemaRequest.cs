using FadeCinema.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Requests
{
    public class CinemaRequest
    {
        public Cinema ToDomain()
        {
            return new Cinema
            { 
                Name = Name,
                Description = Description,
                Address = Location.Address,
                Longitude = Location.Longitude,
                Latitude = Location.Latitude,
                Country = Location.Country,
                State = Location.State,
                City = Location.City,
                District = Location.District,
                ZipCode = Location.ZipCode,
            };
        }

        [JsonPropertyName("name")]
        [Required(ErrorMessage = "Cinema's name cannot be empty.")]
        [StringLength(100, ErrorMessage = "Cinema's name cannot be longer than 100 characters.")]
        public string Name { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("location")]
        public Location Location { get; set; }
    }

    public class Location
    {
        [Required(ErrorMessage = "Cinema's address cannot be empty.")]
        [JsonPropertyName("address")]
        public string Address { get; set; }
        [Required(ErrorMessage = "Cinema's country cannot be empty.")]
        [JsonPropertyName("country")]
        public string Country { get; set; }
        [JsonPropertyName("state")]
        public string State { get; set; }
        [Required(ErrorMessage = "Cinema's city cannot be empty.")]
        [JsonPropertyName("city")]
        public string City { get; set; }
        [JsonPropertyName("district")]
        public string District { get; set; }
        [JsonPropertyName("zipCode")]
        public string ZipCode { get; set; }
        [JsonPropertyName("longitude")]
        [Range(-180.0, 180.0, ErrorMessage = "Longitude must be a valid double number from -180 to 180.")]
        public double? Longitude { get; set; }
        [JsonPropertyName("latitude")]
        [Range(-90.0, 90.0, ErrorMessage = "Latitude must be a valid double number from -180 to 180.")]
        public double? Latitude { get; set; }
    }
}
