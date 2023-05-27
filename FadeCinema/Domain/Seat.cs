using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FadeCinema.Domain
{
    public class Seat
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string AuditoriumId { get; set; }
        [ForeignKey("AuditoriumId")]
        public Auditorium Auditorium { get; set; }
        public int Number {get; set; }
        [Required]
        public int Position { get; set; }
        [Required]
        public bool IsSelected { get; set; }

        [Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }

    }
}
