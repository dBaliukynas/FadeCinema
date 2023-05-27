using System.ComponentModel.DataAnnotations;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace FadeCinema.Domain
{
    public class File
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public ApplicationUser User { get; set; }
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string EntityId { get; set; }
        public string EntityName { get; set; }
        public string Url { get; set; }
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }
    }
}
