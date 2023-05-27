using FadeCinema.Domain;
using FadeCinema.Models.V1.Requests;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Routes.V1;
using FadeCinema.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FadeCinema.Controllers.V1
{
    [ApiController]
    public class AuditoriumsController : Controller
    {
        private IAuditoriumService _auditoriumService;

        public AuditoriumsController(IAuditoriumService auditoriumService)
        {
            _auditoriumService = auditoriumService;
        }

        [HttpGet(ApiRoutes.Auditoriums.Get)]
        public async Task<IActionResult> Get(string auditoriumId)
        {
            var (auditorium, entitySeats) = await _auditoriumService.GetAuditoriumById(auditoriumId);

            return Ok(auditorium.ToResponse(entitySeats.Select(entitySeat => entitySeat.ToResponse()).ToArray()));
        }

        [HttpGet(ApiRoutes.Auditoriums.GetAll)]
        public async Task<IActionResult> GetAll(string cinemaId)
        {
            var auditoriums = await _auditoriumService.GetAuditoriums(cinemaId);

            return Ok(auditoriums.Select(auditorium => auditorium.ToResponse()));
        }


        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpPost(ApiRoutes.Auditoriums.Create)]
        public async Task<IActionResult> Create(string cinemaId, CreateAuditoriumRequest auditoriumRequest)
        {
            var seats = auditoriumRequest.Seats.Select(seat => seat.ToDomain()).ToArray();
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var (auditorium, entitySeats) = await _auditoriumService.CreateAuditorium(cinemaId, auditoriumRequest.ToDomain(), userId, seats);

            return Ok(auditorium.ToResponse(entitySeats.Select(entitySeat => entitySeat.ToResponse()).ToArray()));
        }
        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpPost(ApiRoutes.Auditoriums.Update)]
        public async Task<IActionResult> Update(string cinemaId, string auditoriumId, UpdateAuditoriumRequest auditoriumRequest)
        {
            var auditorium = await _auditoriumService.UpdateAuditorium(cinemaId, auditoriumId, auditoriumRequest.ToDomain());

            return Ok(auditorium.ToResponse());
        }
        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpDelete(ApiRoutes.Auditoriums.Delete)]
        public async Task<IActionResult> Delete(string auditoriumId)
        {
            var auditoriumResponse = await _auditoriumService.DeleteAuditorium(auditoriumId);

            if (auditoriumResponse.ErrorMessages != null)
            {
                return BadRequest(auditoriumResponse.ErrorMessages);
            }

            return Ok(auditoriumResponse);
        }
    }
}
