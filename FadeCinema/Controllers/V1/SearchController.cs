using FadeCinema.Models.V1.Responses;
using FadeCinema.Routes.V1;
using FadeCinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace FadeCinema.Controllers.V1
{
    [ApiController]
    public class SearchController : Controller
    {
        private ICinemaService _cinemaService;
        private IMovieService _movieService;
        private IAuditoriumService _auditoriumService;

        public SearchController(ICinemaService cinemaService, IMovieService movieService, IAuditoriumService auditoriumService)
        {
            _cinemaService = cinemaService;
            _movieService = movieService;
            _auditoriumService = auditoriumService;
        }

        [HttpGet(ApiRoutes.Search.GetMovies)]
        public async Task<IActionResult> GetMovies([FromQuery] int page, [FromQuery] string value)
        {
            var (movies, hasMore) = await _movieService.GetMoviesByContainingString(page, value);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(movies.Select(movie => movie.ToResponse()));
        }


        [HttpGet(ApiRoutes.Search.GetCinemas)]
        public async Task<IActionResult> GetCinemas([FromQuery] int page, [FromQuery] string value)
        {
            var (cinemas, hasMore) = await _cinemaService.GetCinemasByContainingString(page, value);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(cinemas.Select(cinema => cinema.ToResponse()));
        }


        [HttpGet(ApiRoutes.Search.GetAuditoriums)]
        public async Task<IActionResult> GetAuditoriums([FromQuery] int page, [FromQuery] string value)
        {
            var (auditoriums, hasMore) = await _auditoriumService.GetAuditoriumsByContainingString(page, value);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(auditoriums.Select(auditorium => auditorium.ToResponse()));
        }
    }
}
