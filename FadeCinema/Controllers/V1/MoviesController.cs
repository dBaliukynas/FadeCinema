using FadeCinema.Domain;
using FadeCinema.Models.V1.Requests;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Routes.V1;
using FadeCinema.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FadeCinema.Controllers.V1
{
    [ApiController]
    public class MoviesController : Controller
    {
        private readonly IMovieService _movieService;
        public MoviesController( IMovieService movieService)
        {
   
            _movieService = movieService;
        }
        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpPost(ApiRoutes.Movies.Create)]
        public async Task<IActionResult> Create(MovieRequest movieRequest)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var movie = await _movieService.CreateMovie(movieRequest.ToDomain(), userId);

            return Ok(movie.ToResponse());
        }

        [HttpGet(ApiRoutes.Movies.Get)]
        public async Task<IActionResult> Get(string movieId)
        {
            var movie = await _movieService.GetMovieById(movieId);

            return Ok(movie.ToResponse());
        }

        [HttpGet(ApiRoutes.Movies.GetAll)]
        public async Task<IActionResult> GetAll([FromQuery] int page)
        {
            var (movies, hasMore) = await _movieService.GetMovies(page);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(movies.Select(movie => movie.ToResponse()));
        }
        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpPost(ApiRoutes.Movies.Update)]
        public async Task<IActionResult> Update(string movieId, MovieRequest movieRequest)
        {
            var movie = await _movieService.UpdateMovie(movieId, movieRequest.ToDomain());

            return Ok(movie.ToResponse());
        }
        [HttpDelete(ApiRoutes.Movies.Delete)]
        public async Task<IActionResult> Delete(string movieId)
        {
            var movieResponse = await _movieService.DeleteMovie(movieId);

            if (movieResponse.ErrorMessages != null)
            {
                return BadRequest(movieResponse.ErrorMessages);
            }


            return Ok(movieResponse);
        }
    }
}
