using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FadeCinema.Services
{
    public interface ICinemaService
    {
        public Task<Cinema> GetCinemaById(string cinemaId);
        public Task<(List<Cinema>, bool)> GetCinemas(int page);
        public Task<(List<Cinema>, bool)> GetCinemasByContainingString(int page, string value);
        public Task<Cinema> CreateCinema(Cinema cinema, string userId);
        public Task<Cinema> UpdateCinema(string cinemaId, Cinema cinema);
        public Task<CinemaResponse> DeleteCinema(string cinemaId);
    }
}
