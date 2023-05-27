using FadeCinema.Data;
using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FadeCinema.Services
{
    public class PurchasedTicketService : IPurchasedTicketService
    {
        private ApplicationDbContext _dbContext;
        public PurchasedTicketService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<PurchasedTicket>> GetPurchasedTicketsByScreeningId(string screeningId, string userId)
        {
            var purchasedTickets = await _dbContext.PurchasedTickets
                .Include(purchasedTicket => purchasedTicket.User)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat.Screening)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat.Screening.User)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat.Screening.Movie)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat.Screening.Auditorium)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat.Screening.Auditorium.Cinema)
                .Include(purchasedTicket => purchasedTicket.TicketCategory)
                .Where(purchasedTicket => purchasedTicket.User.Id == userId)
                .Where(purchasedTicket => purchasedTicket.ScreeningSeat.ScreeningId == screeningId)
                .ToListAsync();

            return purchasedTickets;

        }

        public async Task<(List<PurchasedTicket>, bool)> GetPurchasedTickets(int page, string userId)
        {
            var pageSize = 20;

            var purchasedTickets = await _dbContext.PurchasedTickets
                .Skip(page * pageSize)
                .Take(pageSize)
                .Include(purchasedTicket => purchasedTicket.User)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat.Screening)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat.Screening.User)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat.Screening.Movie)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat.Screening.Auditorium)
                .Include(purchasedTicket => purchasedTicket.ScreeningSeat.Screening.Auditorium.Cinema)
                .Include(purchasedTicket => purchasedTicket.TicketCategory)
                .Where(purchasedTicket => purchasedTicket.User.Id == userId)
                .ToListAsync();

            var hasMore = await _dbContext.Cinemas.Skip((page + 1) * pageSize).AnyAsync();

            return (purchasedTickets, hasMore);

        }
        public async Task<(List<PurchasedTicketHistory>, bool)> GetPurchasedTicketHistory(int page, string userId)
        {
            var pageSize = 20;

            var purchasedTicketHistory = await _dbContext.PurchasedTicketHistory
                .Skip(page * pageSize)
                .Take(pageSize)
                .Include(purchasedTicket => purchasedTicket.User)
                .Where(purchasedTicket => purchasedTicket.User.Id == userId)
                .ToListAsync();

            var hasMore = await _dbContext.PurchasedTicketHistory.Skip((page + 1) * pageSize).AnyAsync();

            return (purchasedTicketHistory, hasMore);

        }

    }
}
