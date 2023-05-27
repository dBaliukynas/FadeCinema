using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FadeCinema.Services
{
    public interface IScreeningService
    {
        public Task<(List<Screening>, bool)> GetScreeningsByMovieId(string movieId, string userId, int page);
        public Task<(Screening, ScreeningSeat[])> GetScreeningById(string screeningId);
        public Task<ScreeningResponse> CreateScreening(string movieId, string auditoriumId, string ticketCategoryId, Screening screening, string userId);
        public Task<(Screening, ScreeningSeat[])> DeleteScreening(string screeningId);
    }
}
