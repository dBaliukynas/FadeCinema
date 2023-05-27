using FadeCinema.Models.V1.Responses;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Requests
{
    public class ScreeningSeatRequest
    {
        public string Id { get; set; }
        [JsonPropertyName("number")]
        public int Number { get; set; }
        [JsonPropertyName("position")]
        public int Position { get; set; }
        [JsonPropertyName("isSelected")]
        public bool IsSelected { get; set; }
        [JsonPropertyName("isReserved")]
        public bool IsReserved { get; set; }
    }
}
