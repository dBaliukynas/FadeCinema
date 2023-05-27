using FadeCinema.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace FadeCinema.Models.V1.Requests
{
    public class ScreeningRequest
    {
        public Screening ToDomain()
        {
            return new Screening
            {
                TicketCategoryId = TicketCategoryId,
                AuditoriumId = AuditoriumId,
                MovieId = MovieId,
                StartTime = StartTime,
                EndTime = EndTime,
            };
        }
        [Required(ErrorMessage = "Screening's ticket category ID cannot be empty.")]
        public string TicketCategoryId { get; set; }
        [Required(ErrorMessage = "Screening's auditorium ID cannot be empty.")]
        public string AuditoriumId { get; set; }
        [Required(ErrorMessage = "Screening's movie ID cannot be empty.")]
        public string MovieId { get; set; }
        [Required(ErrorMessage = "Screening's start time cannot be empty.")]
        public DateTime StartTime { get; set; }
        [Required(ErrorMessage = "Screening's end time cannot be empty.")]
        public DateTime EndTime { get; set; }
    }
}
