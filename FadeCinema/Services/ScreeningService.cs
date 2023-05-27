using FadeCinema.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using FadeCinema.Data;
using System.Linq;
using System.Collections.Generic;
using System.Drawing.Printing;
using FadeCinema.Models.V1.Responses;
using static FadeCinema.Routes.V1.ApiRoutes;

namespace FadeCinema.Services
{
    public class ScreeningService : IScreeningService
    {
        private ApplicationDbContext _dbContext;

        public ScreeningService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<(List<Screening>, bool)> GetScreeningsByMovieId(string movieId, string userId, int page)
        {
            var pageSize = 20;

            var purchasedTicketIds = await _dbContext.PurchasedTickets
                .Where(purchasedTicket => purchasedTicket.User.Id == userId)
                .Select(purchasedTicket => purchasedTicket.ScreeningSeat.ScreeningId)
                .ToListAsync();

            var screeningEntities = await _dbContext.Screenings
                .Include(screening => screening.User)
                .Include(screening => screening.Movie)
                .Include(screening => screening.Auditorium)
                .Include(screening => screening.Auditorium.Cinema)
                .Include(screening => screening.TicketCategory)
                .Where(screening => screening.MovieId == movieId)
                .OrderByDescending(screening => purchasedTicketIds.Contains(screening.Id))
                .ThenBy(screening => screening.StartTime)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var hasMore = await _dbContext.Screenings.Skip((page + 1) * pageSize).AnyAsync();

            return (screeningEntities, hasMore);
        }
        public async Task<(Screening, ScreeningSeat[])> GetScreeningById(string screeningId)
        {
            var screeningEntity = await _dbContext.Screenings
                .Include(screening => screening.User)
                .Include(screening => screening.Movie)
                .Include(screening => screening.Auditorium)
                .Include(screening => screening.Auditorium.Cinema)
                .Include(screening => screening.TicketCategory)
                .FirstOrDefaultAsync(screening => screening.Id == screeningId);
            var seats = await _dbContext.ScreeningSeats.Where(seat => seat.ScreeningId == screeningEntity.Id).OrderBy(seat => seat.Position).ToArrayAsync();

            return (screeningEntity, seats);
        }
        public async Task<ScreeningResponse> CreateScreening(string movieId, string auditoriumId, string ticketCategoryId, Screening screening, string userId)
        {


            Screening screeningEntity = null;
            var auditoriumScreenings = await _dbContext.Screenings.Where(screening => screening.AuditoriumId == auditoriumId).ToArrayAsync();

            var seats = await _dbContext.Seats.Where(seat => seat.AuditoriumId == screening.AuditoriumId).OrderBy(seat => seat.Position).ToArrayAsync();
            var screeningSeats = seats.Select(seat => new ScreeningSeat
            {
                Number = seat.Number,
                Position = seat.Position,
                IsSelected = seat.IsSelected,
                ScreeningId = screening.Id
            });

            foreach (Screening auditoriumScreening in auditoriumScreenings)
            {
                if (screening.StartTime <= auditoriumScreening.EndTime && auditoriumScreening.StartTime <= screening.EndTime)
                {
                    return (new ScreeningResponse
                    {
                        ErrorMessages = new[] { "Screening time overlaps with another screening in the same auditorium." },
                    });
                }
            }

            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    screening.AuthorId = userId;
                    screening.User = await _dbContext.Users.FindAsync(userId);
                    screening.MovieId = movieId;
                    screening.Movie = await _dbContext.Movies.FindAsync(screening.MovieId);
                    screening.Auditorium = await _dbContext.Auditoriums.FindAsync(screening.AuditoriumId);
                    screening.Auditorium.Cinema = await _dbContext.Cinemas.FindAsync(screening.Auditorium.CinemaId);
                    screening.TicketCategory = await _dbContext.TicketCategories.FindAsync(screening.TicketCategoryId);
                    screeningEntity = (await _dbContext.AddAsync(screening)).Entity;
                    screeningSeats = screeningSeats.Select(screeningSeat => { screeningSeat.Screening = screeningEntity; return screeningSeat; });
                    await _dbContext.SaveChangesAsync();
                    await _dbContext.BulkInsertAsync(screeningSeats);
                    await _dbContext.BulkSaveChangesAsync();
                    transaction.Commit();
                }
                catch (Exception e)
                {
                    transaction.Rollback();
                }
            }


            return (screeningEntity.ToResponse(screeningSeats.Select(screeningSeat => screeningSeat.ToResponse()).ToArray()));
        }

        public async Task<(Screening, ScreeningSeat[])> DeleteScreening(string screeningId)
        {
            var (screeningEntity, screeningSeats) = await GetScreeningById(screeningId);
            var purchasedTickets = await _dbContext.PurchasedTickets
                .Where(purchasedTicket => purchasedTicket.ScreeningSeat.Screening.Id == screeningEntity.Id)
                .ToListAsync();

            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var purchasedTicketHistory = new List<PurchasedTicketHistory>();

                    foreach (PurchasedTicket purchasedTicket in purchasedTickets)
                    {
                        purchasedTicketHistory.Add(new PurchasedTicketHistory
                        {
                            AuthorId = purchasedTicket.AuthorId,
                            AuditoriumName = purchasedTicket.ScreeningSeat.Screening.Auditorium.Name,
                            MovieName = purchasedTicket.ScreeningSeat.Screening.Movie.Name,
                            StartTime = purchasedTicket.ScreeningSeat.Screening.StartTime,
                            EndTime = purchasedTicket.ScreeningSeat.Screening.EndTime,
                            SeatRow = ((char)('A' + (purchasedTicket.ScreeningSeat.Number != purchasedTicket.ScreeningSeat.Screening.Auditorium.Columns ? purchasedTicket.ScreeningSeat.Position / purchasedTicket.ScreeningSeat.Screening.Auditorium.Columns : (purchasedTicket.ScreeningSeat.Position / purchasedTicket.ScreeningSeat.Screening.Auditorium.Columns) - 1))).ToString(),
                            SeatNumber = purchasedTicket.ScreeningSeat.Number.ToString(),
                            TicketCategoryName = purchasedTicket.ScreeningSeat.Screening.TicketCategory.Name,
                            TicketCategoryPrice = purchasedTicket.ScreeningSeat.Screening.TicketCategory.Price,
                        });
                    }
                    _dbContext.BulkInsert(purchasedTicketHistory);
                    _dbContext.BulkDelete(purchasedTickets);
                    _dbContext.BulkDelete(screeningSeats);
                    _dbContext.Remove(screeningEntity);

                    await _dbContext.BulkSaveChangesAsync();
                    transaction.Commit();
                }

                catch (Exception e)
                {
                    transaction.Rollback();
                }
            }

            screeningSeats = screeningSeats.Select(screeningSeat => { screeningSeat.Screening = screeningEntity; return screeningSeat; }).ToArray();
            return (screeningEntity, screeningSeats);
        }
    }
}
