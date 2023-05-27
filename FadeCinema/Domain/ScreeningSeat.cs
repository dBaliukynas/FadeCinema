using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace FadeCinema.Domain
{
    public class ScreeningSeat
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string ScreeningId { get; set; }
        [ForeignKey("ScreeningId")]
        public Screening Screening { get; set; }
        public int Number { get; set; }
        [Required]
        public int Position { get; set; }
        [Required]
        public bool IsSelected { get; set; }
        [Required]
        public bool IsReserved { get; set; }

        [Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }
    }
}