using FadeCinema.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Requests
{
    public class SeatRequest
    {
        public Seat ToDomain()
        {
            return new Seat
            {
                Number = Number,
                Position = Position,
                IsSelected = IsSelected,
            };
    }
    [JsonPropertyName("number")]
    [Required]
     public int Number { get; set; }
    [JsonPropertyName("position")]
    [Required]
    public int Position { get; set; }
    [JsonPropertyName("isSelected")]
    [Required]
    public bool IsSelected { get; set; }
}
}
