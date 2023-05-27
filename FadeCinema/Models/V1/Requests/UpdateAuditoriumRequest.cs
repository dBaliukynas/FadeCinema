using FadeCinema.Domain;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Requests
{
    public class UpdateAuditoriumRequest
    {
        public Auditorium ToDomain()
        {
            return new Auditorium
            {
                Name = Name,
            };
        }
        [JsonPropertyName("name")]
        [Required]
        public string Name { get; set; }
    }
}

