using FadeCinema.Domain;
using System;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Responses
{
    public class PurchasedTicketHistoryResponse
    {
        public string Id { get; set; }
        [JsonPropertyName("authorId")]
        public string AuthorId { get; set; }
        public UserResponse User { get; set; }
        [JsonPropertyName("auditoriumName")]
        public string AuditoriumName { get; set; }
        [JsonPropertyName("movieName")]
        public string MovieName { get; set; }
        [JsonPropertyName("screeningStartTime")]
        public DateTime StartTime { get; set; }
        [JsonPropertyName("screeningEndTime")]
        public DateTime EndTime { get; set; }
        [JsonPropertyName("seatRow")]
        public string SeatRow { get; set; }
        [JsonPropertyName("seatNumber")]
        public string SeatNumber { get; set; }
        [JsonPropertyName("ticketCategoryName")]
        public string TicketCategoryName { get; set; }
        [JsonPropertyName("ticketCategoryPrice")]
        public double TicketCategoryPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public static class PurchasedTicketHistoryResponseExtensions
    {
        public static PurchasedTicketHistoryResponse ToResponse(this PurchasedTicketHistory purchasedTicketHistory)
        {
            return new PurchasedTicketHistoryResponse
            {
                Id = purchasedTicketHistory.Id,
                AuthorId = purchasedTicketHistory.AuthorId,
                MovieName = purchasedTicketHistory.MovieName,
                AuditoriumName = purchasedTicketHistory.AuditoriumName,
                StartTime = purchasedTicketHistory.StartTime,
                User = purchasedTicketHistory.User.ToResponse(),
                EndTime = purchasedTicketHistory.EndTime,
                TicketCategoryName = purchasedTicketHistory.TicketCategoryName,
                TicketCategoryPrice = purchasedTicketHistory.TicketCategoryPrice,
                SeatNumber = purchasedTicketHistory.SeatNumber,
                SeatRow = purchasedTicketHistory.SeatRow,
                CreatedAt = purchasedTicketHistory.CreatedAt,
            };

        }
    }
}

