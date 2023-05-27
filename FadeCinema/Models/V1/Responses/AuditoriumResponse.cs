using FadeCinema.Domain;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static FadeCinema.Routes.V1.ApiRoutes;

namespace FadeCinema.Models.V1.Responses
{
    public class AuditoriumResponse
    {
        public string Id { get; set; }
        public string CinemaId { get; set; }
        public CinemaResponse Cinema { get; set; }
        public string AuthorId { get; set; }
        public UserResponse User { get; set; }
        [Required]
        public string Name { get; set; }
        public int Columns { get; set; }
        [Required]
        public int SeatCount { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public SeatResponse[] Seats { get; set; }
        public IEnumerable<string> ErrorMessages { get; set; }
    }

    public static class AuditoriumExtensions
    {
        public static AuditoriumResponse ToResponse(this Auditorium auditorium, SeatResponse[] seats = null)
        {
          var auditoriumResponse = new AuditoriumResponse
            {
                Id = auditorium.Id,
                CinemaId = auditorium.CinemaId,
                AuthorId = auditorium.AuthorId,
                Name = auditorium.Name,
                Columns = auditorium.Columns,
                SeatCount = auditorium.SeatCount,
                Cinema = auditorium.Cinema.ToResponse(),
                User = auditorium.User.ToResponse()
            };

            if (seats != null)
            {
                auditoriumResponse.Seats = seats;
            }

            return auditoriumResponse;
        }
    }

}
