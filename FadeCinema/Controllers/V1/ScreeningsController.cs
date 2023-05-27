using FadeCinema.Domain;
using FadeCinema.Models.V1.Requests;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Routes.V1;
using FadeCinema.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FadeCinema.Controllers.V1
{

    [ApiController]
    public class ScreeningsController : Controller
    {
        private IScreeningService _screeningService;

        public ScreeningsController(IScreeningService screeningService)
        {
            _screeningService = screeningService;
        }


        [HttpGet(ApiRoutes.Screenings.GetByMovieId)]
        public async Task<IActionResult> GetScreeningsByMovieId(string movieId, [FromQuery] int page)
        {
            string userId = null;

            if (User.Identity.IsAuthenticated)
            {
                userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            }

            var (screenings, hasMore) = await _screeningService.GetScreeningsByMovieId(movieId, userId, page);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(screenings.Select(screening => screening.ToResponse()));
        }

        [HttpGet(ApiRoutes.Screenings.Get)]
        public async Task<IActionResult> Get(string screeningId)
        {
            var (screening, entitySeats) = await _screeningService.GetScreeningById(screeningId);

            return Ok(screening.ToResponse(entitySeats.Select(entitySeat => entitySeat.ToResponse()).ToArray()));
        }


        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpPost(ApiRoutes.Screenings.Create)]
        public async Task<IActionResult> Create(string movieId, string auditoriumId, string ticketCategoryId, ScreeningRequest screeningRequest)
        {

            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var screeningResponse = await _screeningService.CreateScreening(movieId, auditoriumId, ticketCategoryId, screeningRequest.ToDomain(), userId);
            if (screeningResponse.ErrorMessages != null) {
                return BadRequest(screeningResponse.ErrorMessages);
            }

            return Ok(screeningResponse);
        }

        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpDelete(ApiRoutes.Screenings.Delete)]
        public async Task<IActionResult> Delete(string screeningId)
        {
            var (screening, entitySeats) = await _screeningService.DeleteScreening(screeningId);

            return Ok(screening.ToResponse(entitySeats.Select(entitySeat => entitySeat.ToResponse()).ToArray()));
        }


    }
}



