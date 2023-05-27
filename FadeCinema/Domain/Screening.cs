using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace FadeCinema.Domain
{
    public class Screening
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public ApplicationUser User { get; set; }
        public string TicketCategoryId { get; set; }
        [ForeignKey("TicketCategoryId")]
        public TicketCategory TicketCategory{ get; set; }
        public string AuditoriumId { get; set; }
        [ForeignKey("AuditoriumId")]
        public Auditorium Auditorium { get; set; }
        public string MovieId { get; set; }
        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        [Required]
        public int AvailableSeatCount { get; set; }
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? UpdatedAt { get; set; }
    }
}
