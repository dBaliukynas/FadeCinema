using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FadeCinema.Domain
{
    public class Cinema
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public ApplicationUser User { get; set; }
        [MaxLength(100)]
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public string? Address { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        [Required]
        public string Country { get; set; }
        public string? State { get; set; }
        [Required]
        public string City { get; set; }
        public string? District { get; set; }
        public string? ZipCode { get; set; }
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt  { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? UpdatedAt { get; set; }

    }
}
