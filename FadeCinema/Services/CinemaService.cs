using FadeCinema.Data;
using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Settings;
using FadeCinema.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Threading.Tasks;
using static FadeCinema.Routes.V1.ApiRoutes;

namespace FadeCinema.Services
{
    public class CinemaService : ICinemaService
    {
        private ApplicationDbContext _dbContext;
        private readonly MapboxAccessToken _mapboxAccessToken;
        public CinemaService(ApplicationDbContext dbContext, IOptions<MapboxAccessToken> mapboxAccessToken)
        {
            _dbContext = dbContext;
            _mapboxAccessToken = mapboxAccessToken.Value;
        }

        public async Task<Cinema> GetCinemaById(string cinemaId)
        {
            var cinema = await _dbContext.Cinemas
                .Include(cinema => cinema.User)
                .FirstOrDefaultAsync(cinema => cinema.Id == cinemaId);

            return cinema;
        }

        public async Task<(List<Cinema>, bool)> GetCinemas(int page)
        {
            var pageSize = 20;
            var cinemas = await _dbContext.Cinemas.Skip(page * pageSize).Take(pageSize).Include(cinema => cinema.User).ToListAsync();
            var hasMore = await _dbContext.Cinemas.Skip((page + 1) * pageSize).AnyAsync();

            return (cinemas, hasMore);
        }

        public async Task<(List<Cinema>, bool)> GetCinemasByContainingString(int page, string value)
        {
            const int pageSize = 20;
            var cinemas = await _dbContext.Cinemas
                .Skip(page * pageSize)
                .Take(pageSize)
                .Include(cinema => cinema.User)
                .Where(cinema => cinema.Name.ToLower().Contains(value.ToLower()))
                .ToListAsync();
            var hasMore = await _dbContext.Cinemas.Skip((page + 1) * pageSize).AnyAsync();

            return (cinemas, hasMore);
        }

        public async Task<Cinema> CreateCinema(Cinema cinema, string userId)
        {
            cinema.AuthorId = userId;
            cinema.User = await _dbContext.Users.FindAsync(userId);
            var entity = _dbContext.Add(cinema).Entity;
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<Cinema> UpdateCinema(string cinemaId, Cinema cinema)
        {
            var entity = await GetCinemaById(cinemaId);
            _dbContext.Entry(entity).State = EntityState.Detached;

            cinema.Id = entity.Id;
            cinema.User = entity.User;
            cinema.CreatedAt = entity.CreatedAt;
            cinema.UpdatedAt = DateTime.Now;
            entity = _dbContext.Cinemas.Update(cinema).Entity;
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<CinemaResponse> DeleteCinema(string cinemaId)
        {
            var cinema = await GetCinemaById(cinemaId);
            var auditoriums = await _dbContext.Auditoriums.Where(auditorium => auditorium.CinemaId == cinemaId).ToListAsync();
            var seats = await _dbContext.Seats
                .Where(seat => auditoriums.Select(auditorium => auditorium.Id)
                .Contains(seat.AuditoriumId)).ToListAsync();

            var screeningEntities = await _dbContext.Screenings
               .Where(screening => screening.Auditorium.Cinema.Id == cinemaId)
               .Include(screening => screening.User)
               .Include(screening => screening.Movie)
               .Include(screening => screening.Auditorium)
               .Include(screening => screening.Auditorium.Cinema)
               .Include(screening => screening.TicketCategory).ToListAsync();

            if (screeningEntities.Count != 0)
            {
                return (new CinemaResponse
                {
                    ErrorMessages = new[] { "There is a screening that currently uses this cinema." },
                });
            }


            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    await _dbContext.BulkDeleteAsync(seats);
                    await _dbContext.BulkDeleteAsync(auditoriums);
                    _dbContext.Remove(cinema);
                    await _dbContext.BulkSaveChangesAsync();
                    transaction.Commit();
                }

                catch (Exception e)
                {
                    transaction.Rollback();
                }
            }


            return cinema.ToResponse();
        }
    }
}
