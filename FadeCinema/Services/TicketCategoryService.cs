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
using static FadeCinema.Routes.V1.ApiRoutes;

namespace FadeCinema.Services
{
    public class TicketCategoryService : ITicketCategoryService
    {
        private ApplicationDbContext _dbContext;
        public TicketCategoryService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<TicketCategory> GetTicketCategoryById(string ticketCategoryId)
        {
            var ticketCategory = await _dbContext.TicketCategories
                .Include(ticketCategory => ticketCategory.User)
                .FirstOrDefaultAsync(ticketCategory => ticketCategory.Id == ticketCategoryId);

            return ticketCategory;
        }
        public async Task<(List<TicketCategory>, bool)> GetTicketCategories(int page)
        {
            var pageSize = 20;

            var ticketCategories = await _dbContext.TicketCategories
                .Skip(page * pageSize)
                .Take(pageSize)
                .Include(ticketCategory => ticketCategory.User)
                .ToListAsync();

            var hasMore = await _dbContext.Cinemas.Skip((page + 1) * pageSize).AnyAsync();

            return (ticketCategories, hasMore);

        }
        public async Task<TicketCategory> CreateTicketCategory(TicketCategory ticketCategory, string userId)
        {
            ticketCategory.AuthorId = userId;
            ticketCategory.User = await _dbContext.Users.FindAsync(userId);
            var entity = _dbContext.Add(ticketCategory).Entity;
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<TicketCategory> UpdateTicketCategory(string ticketCategoryId, TicketCategory ticketCategory)
        {
            var entity = await GetTicketCategoryById(ticketCategoryId);
            _dbContext.Entry(entity).State = EntityState.Detached;

            ticketCategory.Id = entity.Id;
            ticketCategory.User = entity.User;
            ticketCategory.CreatedAt = entity.CreatedAt;
            ticketCategory.UpdatedAt = DateTime.Now;
            entity = _dbContext.TicketCategories.Update(ticketCategory).Entity;
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<TicketCategoryResponse> DeleteTicketCategory(string ticketCategoryId)
        {
            var entity = await GetTicketCategoryById(ticketCategoryId);

            var screeningEntities = await _dbContext.Screenings
                .Where(screening => screening.TicketCategoryId == ticketCategoryId)
                .Include(screening => screening.User)
                .Include(screening => screening.Movie)
                .Include(screening => screening.Auditorium)
                .Include(screening => screening.Auditorium.Cinema)
                .Include(screening => screening.TicketCategory).ToListAsync();

            if (screeningEntities.Count != 0)
            {
                return (new TicketCategoryResponse
                {
                    ErrorMessages = new[] { "There is a screening that currently uses this ticket category." },
                });
            }

            _dbContext.Remove(entity);
            await _dbContext.SaveChangesAsync();

            return entity.ToResponse();
        }
    }
}
