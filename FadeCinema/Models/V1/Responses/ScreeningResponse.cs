using System.ComponentModel.DataAnnotations;
using System;
using FadeCinema.Domain;
using System.Collections.Generic;

namespace FadeCinema.Models.V1.Responses
{
    public class ScreeningResponse
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        [Required]
        public string TicketCategoryId { get; set; }
        [Required]
        public TicketCategoryResponse? TicketCategory { get; set; }
        public string AuditoriumId { get; set; }
        public AuditoriumResponse? Auditorium { get; set; }
        [Required]
        public string MovieId { get; set; }
        public MovieResponse? Movie { get; set; }
        public UserResponse User { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        public ScreeningSeatResponse[] Seats { get; set; }
        public IEnumerable<string> ErrorMessages { get; set; }
    }

    public static class ScreeningExtensions
    {
        public static ScreeningResponse ToResponse(this Screening screening, ScreeningSeatResponse[] seats = null)
        {
            var screeningResponse = new ScreeningResponse
            {
                Id = screening.Id,
                TicketCategoryId = screening.TicketCategoryId,
                AuditoriumId = screening.AuditoriumId,
                MovieId = screening.MovieId,
                Movie = screening.Movie.ToResponse(),
                AuthorId = screening.AuthorId,
                User = screening.User.ToResponse(),
                Auditorium = screening.Auditorium.ToResponse(),
                TicketCategory = screening.TicketCategory.ToResponse(),
                StartTime = screening.StartTime,
                EndTime = screening.EndTime,
            };

            if (seats != null)
            {
                screeningResponse.Seats = seats;
            }

            return screeningResponse;
        }
    }
}
