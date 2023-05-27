using FadeCinema.Domain;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Responses
{
    public class TicketPurchaseResponse
    {
        public string Id { get; set; }
        [JsonPropertyName("authorId")]
        public string AuthorId { get; set; }
        public UserResponse User { get; set; }
        public ScreeningResponse ScreeningResponse { get; set; }
        [JsonPropertyName("screeningSeatId")]
        public string ScreeningSeatId { get; set; }
        [JsonPropertyName("screeningSeatResponse")]
        public ScreeningSeatResponse ScreeningSeatResponse { get; set; }
        [JsonPropertyName("ticketCategoryId")]
        public string TicketCategoryId { get; set; }
        [JsonPropertyName("ticketCategoryResponse")]
        public TicketCategoryResponse TicketCategoryResponse { get; set; }
    }

    public static class TicketPurchaseExtensions
    {
        public static TicketPurchaseResponse ToResponse(this PurchasedTicket ticket)
        {
            return new TicketPurchaseResponse
            {
                Id = ticket.Id,
                AuthorId = ticket.AuthorId,
                User = ticket.User.ToResponse(),
                ScreeningSeatId = ticket.ScreeningSeatId,
                TicketCategoryId = ticket.TicketCategoryId,
                ScreeningSeatResponse = ticket.ScreeningSeat.ToResponse(),
                TicketCategoryResponse = ticket.TicketCategory.ToResponse(),
            };

        }
    }
}

