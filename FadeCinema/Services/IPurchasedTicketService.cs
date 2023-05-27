using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FadeCinema.Services
{
    public interface IPurchasedTicketService
    {
        public Task<List<PurchasedTicket>> GetPurchasedTicketsByScreeningId(string screeningId, string userId);
        public Task<(List<PurchasedTicket>, bool)> GetPurchasedTickets(int page, string userId);
        public Task<(List<PurchasedTicketHistory>, bool)> GetPurchasedTicketHistory(int page, string userId);
    }
}
