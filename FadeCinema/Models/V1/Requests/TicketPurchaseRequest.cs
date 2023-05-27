using FadeCinema.Domain;
using Stripe;
using System.ComponentModel.DataAnnotations.Schema;

namespace FadeCinema.Models.V1.Requests
{
    public class TicketPurchaseRequest
    {
        public string SessionId { get; set; }
        public string TicketCategoryId { get; set; }
        public string[] SeatIds { get; set; }

    }
}
