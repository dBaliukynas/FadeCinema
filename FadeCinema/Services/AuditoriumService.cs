using AutoMapper.Internal;
using FadeCinema.Data;
using FadeCinema.Domain;
using FadeCinema.Models.V1.Requests;
using FadeCinema.Models.V1.Responses;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Threading.Tasks;
using static FadeCinema.Routes.V1.ApiRoutes;

namespace FadeCinema.Services
{
    public class AuditoriumService : IAuditoriumService
    {
        private ApplicationDbContext _dbContext;

        public AuditoriumService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<(Auditorium, Seat[])> GetAuditoriumById(string auditoriumId)
        {
            var auditoriumEntity = await _dbContext.Auditoriums
                .Include(auditorium => auditorium.User)
                .Include(auditorium => auditorium.Cinema)
                .FirstOrDefaultAsync(auditorium => auditorium.Id == auditoriumId);
            var seats = await _dbContext.Seats.Where(seat => seat.AuditoriumId == auditoriumEntity.Id).OrderBy(seat => seat.Position).ToArrayAsync();

            return (auditoriumEntity, seats);
        }

        public async Task<List<Auditorium>> GetAuditoriums(string cinemaId)
        {
            var auditoriumEntities = await _dbContext.Auditoriums
                .Include(auditorium => auditorium.User)
                .Include(auditorium => auditorium.Cinema)
                .Where(auditorium => auditorium.CinemaId == cinemaId)
                .ToListAsync();

            return auditoriumEntities;
        }

        public async Task<(List<Auditorium>, bool)> GetAuditoriumsByContainingString(int page, string value)
        {
            const int pageSize = 20;
            var auditoriums = await _dbContext.Auditoriums
                .Skip(page * pageSize)
                .Take(pageSize)
                .Include(cinema => cinema.User)
                .Include(auditorium => auditorium.Cinema)
                .Where(cinema => cinema.Name.ToLower().Contains(value.ToLower()))
                .ToListAsync();
            var hasMore = await _dbContext.Auditoriums.Skip((page + 1) * pageSize).AnyAsync();

            return (auditoriums, hasMore);
        }

        public async Task<(Auditorium, Seat[])> CreateAuditorium(string cinemaId, Auditorium auditorium, string userId, Seat[] seats)
        {

            Auditorium auditoriumEntity = null;

            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    auditorium.AuthorId = userId;
                    auditorium.User = await _dbContext.Users.FindAsync(userId);
                    auditorium.Cinema = await _dbContext.Cinemas.FindAsync(cinemaId);
                    auditorium.CinemaId = cinemaId;
                    auditorium.SeatCount = seats.Length;
                    auditoriumEntity = (await _dbContext.AddAsync(auditorium)).Entity;
                    await _dbContext.SaveChangesAsync();
                    Array.ForEach(seats, seat => seat.AuditoriumId = auditoriumEntity.Id);
                    await _dbContext.BulkInsertAsync(seats);
                    await _dbContext.BulkSaveChangesAsync();
                    transaction.Commit();
                }
                catch (Exception e)
                {
                    transaction.Rollback();
                }
            }


            return (auditoriumEntity, seats);
        }

        public async Task<Auditorium> UpdateAuditorium(string cinemaId, string auditoriumId, Auditorium auditorium)
        {
            var (auditoriumEntity, seats) = await GetAuditoriumById(auditoriumId);
            _dbContext.Entry(auditoriumEntity).State = EntityState.Detached;

            auditorium.Id = auditoriumEntity.Id;
            auditorium.CinemaId = cinemaId;
            auditorium.User = auditoriumEntity.User;
            auditorium.Cinema = await _dbContext.Cinemas.FindAsync(cinemaId);
            auditorium.SeatCount = auditoriumEntity.SeatCount;
            auditorium.Columns = auditoriumEntity.Columns;
            auditorium.CreatedAt = auditoriumEntity.CreatedAt;
            auditorium.UpdatedAt = DateTime.Now;
            auditoriumEntity = _dbContext.Auditoriums.Update(auditorium).Entity;
            await _dbContext.SaveChangesAsync();

            return auditoriumEntity;
        }

        public async Task<AuditoriumResponse> DeleteAuditorium(string auditoriumId)
        {
            var (auditoriumEntity, seats) = await GetAuditoriumById(auditoriumId);

            var screeningEntities = await _dbContext.Screenings
    .Where(screening => screening.AuditoriumId == auditoriumId)
    .Include(screening => screening.User)
    .Include(screening => screening.Movie)
    .Include(screening => screening.Auditorium)
    .Include(screening => screening.Auditorium.Cinema)
    .Include(screening => screening.TicketCategory).ToListAsync();

            if (screeningEntities.Count != 0)
            {
                return new AuditoriumResponse
                {
                    ErrorMessages = new[] { "There is a screening that currently uses this auditorium." },
                };
            }

            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    _dbContext.BulkDelete(seats);
                    _dbContext.Remove(auditoriumEntity);
                    await _dbContext.BulkSaveChangesAsync();
                    transaction.Commit();
                }

                catch (Exception e)
                {
                    transaction.Rollback();
                }
            }


            return auditoriumEntity.ToResponse(seats.Select(seat => seat.ToResponse()).ToArray());
        }
    }
}
