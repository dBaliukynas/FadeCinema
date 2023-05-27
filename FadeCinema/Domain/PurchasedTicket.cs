using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FadeCinema.Domain
{
    public class PurchasedTicket
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        public string AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public ApplicationUser User { get; set; }
        public string ScreeningSeatId { get; set; }
        [ForeignKey("ScreeningSeatId")]
        public ScreeningSeat ScreeningSeat { get; set; }
        public string TicketCategoryId { get; set; }
        [ForeignKey("TicketCategoryId")]
        public TicketCategory TicketCategory { get; set; }
        [ForeignKey("ScreeningId")]

        [Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }

    }
}
