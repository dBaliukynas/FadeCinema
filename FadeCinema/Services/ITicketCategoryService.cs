using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FadeCinema.Services
{
    public interface ITicketCategoryService
    {
        public Task<TicketCategory> GetTicketCategoryById(string ticketCategoryId);
        public Task<(List<TicketCategory>, bool)> GetTicketCategories(int page);
        public Task<TicketCategory> CreateTicketCategory(TicketCategory ticketCategory, string userId);
        public Task<TicketCategory> UpdateTicketCategory(string ticketCategorId, TicketCategory ticketCategory);
        public Task<TicketCategoryResponse> DeleteTicketCategory(string ticketCategoryId);
    }
}
