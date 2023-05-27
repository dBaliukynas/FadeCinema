using FadeCinema.Domain;
using FadeCinema.Models.V1.Requests;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Routes.V1;
using FadeCinema.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FadeCinema.Controllers.V1
{
    [ApiController]
    public class CinemasController : Controller
    {
        private ICinemaService _cinemaService;

        public CinemasController(ICinemaService cinemaService)
        {
            _cinemaService = cinemaService;
        }

        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpPost(ApiRoutes.Cinemas.Create)]
        public async Task<IActionResult> Create(CinemaRequest cinemaRequest)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var cinema = await _cinemaService.CreateCinema(cinemaRequest.ToDomain(), userId);

            return Ok(cinema.ToResponse());
        }
        [HttpGet(ApiRoutes.Cinemas.Get)]
        public async Task<IActionResult> Get(string cinemaId)
        {
            var cinema = await _cinemaService.GetCinemaById(cinemaId);

            return Ok(cinema.ToResponse());
        }

        [HttpGet(ApiRoutes.Cinemas.GetAll)]
        public async Task<IActionResult> GetAll([FromQuery] int page)
        {
            var (cinemas, hasMore) = await _cinemaService.GetCinemas(page);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(cinemas.Select(cinema => cinema.ToResponse()));
        }

        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpPost(ApiRoutes.Cinemas.Update)]
        public async Task<IActionResult> Update(string cinemaId, CinemaRequest cinemaRequest)
        {
            var cinema = await _cinemaService.UpdateCinema(cinemaId, cinemaRequest.ToDomain());

            return Ok(cinema.ToResponse());
        }

        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpDelete(ApiRoutes.Cinemas.Delete)]
        public async Task<IActionResult> Delete(string cinemaId)
        {
            var cinemaResponse = await _cinemaService.DeleteCinema(cinemaId);

            if (cinemaResponse.ErrorMessages != null)
            {
                return BadRequest(cinemaResponse.ErrorMessages);
            }

            return Ok(cinemaResponse);
        }
    }
}
