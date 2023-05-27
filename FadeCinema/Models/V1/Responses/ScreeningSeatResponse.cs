using FadeCinema.Domain;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Responses
{
    public class ScreeningSeatResponse
    {

        public string Id { get; set; }
        [JsonPropertyName("number")]
        public int Number { get; set; }
        [JsonPropertyName("position")]
        public int Position { get; set; }
        [JsonPropertyName("isSelected")]
        public bool IsSelected { get; set; }
        public bool IsReserved { get; set; }
        public ScreeningResponse? Screening { get; set; }
    }


    public static class ScreeningSeatExtensions
    {
        public static ScreeningSeatResponse ToResponse(this ScreeningSeat seat)
        {
            return new ScreeningSeatResponse
            {
                Id = seat.Id,
                Number = seat.Number,
                Position = seat.Position,
                IsSelected = seat.IsSelected,
                IsReserved = seat.IsReserved,
                Screening = seat.Screening.ToResponse(),
            };

        }
    }
}
