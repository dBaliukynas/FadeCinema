using FadeCinema.Domain;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Responses
{
    public class SeatResponse
    {
        public string Id { get; set; }
        [JsonPropertyName("number")]
        public int Number { get; set; }
        [JsonPropertyName("position")]
        public int Position { get; set; }
        [JsonPropertyName("isSelected")]
        public bool IsSelected { get; set; }
    }

    public static class SeatExtensions
    {
        public static SeatResponse ToResponse(this Seat seat)
        {
            return new SeatResponse
            {
                Id = seat.Id,
                Number = seat.Number,
                Position = seat.Position,
                IsSelected = seat.IsSelected,
            };

        }
    }
}
