using FadeCinema.Domain;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Requests
{
    public class CreateAuditoriumRequest
    {
        public Auditorium ToDomain()
        {
            return new Auditorium
            {
                Name = Name,
                Columns = Columns,
            };
        }
        [JsonPropertyName("name")]
        [Required]
        public string Name { get; set; }
        [Required]
        [JsonPropertyName("columns")]
        public int Columns { get; set; }
        [Required]
        [JsonPropertyName("seats")]
        public SeatRequest[] Seats { get; set; }
    }
}
