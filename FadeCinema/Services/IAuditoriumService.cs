using FadeCinema.Domain;
using FadeCinema.Models.V1.Requests;
using FadeCinema.Models.V1.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FadeCinema.Services
{
    public interface IAuditoriumService
    {
        public Task<(Auditorium, Seat[])> GetAuditoriumById(string auditoriumId);
        public Task<List<Auditorium>> GetAuditoriums(string cinemaId);
        public Task<(List<Auditorium>, bool)> GetAuditoriumsByContainingString(int page, string value);
        public Task<(Auditorium, Seat[])> CreateAuditorium(string CinemaId, Auditorium auditorium, string userId, Seat[] seats);
        public Task<Auditorium> UpdateAuditorium(string CinemaId, string auditoriumId, Auditorium auditorium);
        public Task<AuditoriumResponse> DeleteAuditorium(string auditoriumId);
    }
}
