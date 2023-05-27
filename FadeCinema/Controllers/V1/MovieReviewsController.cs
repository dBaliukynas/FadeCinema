using FadeCinema.Data;
using FadeCinema.Domain;
using FadeCinema.Models.V1.Requests;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Routes.V1;
using FadeCinema.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FadeCinema.Controllers.V1
{
    [ApiController]
    public class MovieReviewsController : Controller
    {
        private readonly IMovieReviewService _movieReviewService;
        private readonly ApplicationDbContext _dbContext;
        public MovieReviewsController(IMovieReviewService movieReviewService, ApplicationDbContext dbContext)
        {
            _movieReviewService = movieReviewService;
            _dbContext = dbContext;
        }

        [Authorize]
        [HttpPost(ApiRoutes.MovieReviews.Create)]
        public async Task<IActionResult> Create(string movieId, MovieReviewRequest movieReviewRequest)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var movieReview = await _dbContext.MovieReviews
                .Where(movieReview => movieReview.User.Id == userId)
                .Where(movieReview => movieReview.MovieId == movieId)
                .FirstOrDefaultAsync();

            var purchasedTicketIds = await _dbContext.PurchasedTickets
                .Where(purchasedTicket => purchasedTicket.User.Id == userId)
                .Select(purchasedTicket => purchasedTicket.ScreeningSeat.ScreeningId)
                .ToListAsync();


            if (movieReview != null)
            {
                return StatusCode(403);
            }

            if (purchasedTicketIds.Count == 0 && !User.IsInRole("SuperAdmin"))
            {
                return Unauthorized();
            }

            var screenings = await _dbContext.Screenings
                .Where(screening => screening.MovieId == movieId)
                .Where(screening => purchasedTicketIds.Contains(screening.Id))
                .ToListAsync();

            var finishedScreenings = screenings.Where(screening => screening.EndTime <= DateTime.UtcNow).ToList();

            if (finishedScreenings.Count == 0)
            {
                return Unauthorized();
            }

            var movieReviewEntity = await _movieReviewService.CreateMovieReview(movieReviewRequest.ToDomain(), movieId, userId);

            return Ok(movieReviewEntity.ToResponse());
        }

        [HttpGet(ApiRoutes.MovieReviews.GetByMovieId)]
        public async Task<IActionResult> GetByMovieId(string movieId, [FromQuery] int page)
        {
            string userId = null;

            if (User.Identity.IsAuthenticated)
            {
                userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            }

            var (movieReviews, hasMore) = await _movieReviewService.GetMovieReviewsByMovieId(movieId, page, userId);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(movieReviews.Select(movieReview => movieReview.ToResponse()));
        }
        [Authorize]
        [HttpGet(ApiRoutes.MovieReviews.GetByUserId)]
        public async Task<IActionResult> GetByUserId([FromQuery] int page)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var (movieReviews, hasMore) = await _movieReviewService.GetMovieReviewsByUserId(page, userId);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(movieReviews.Select(movieReview => movieReview.ToResponse()));
        }
        [Authorize]
        [HttpGet(ApiRoutes.MovieReviews.GetHistoryAll)]
        public async Task<IActionResult> GetHistoryAll([FromQuery] int page)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var (movieReviewHistory, hasMore) = await _movieReviewService.GetMovieReviewHistory(page, userId);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(movieReviewHistory.Select(movieReviewHistoryItem => movieReviewHistoryItem.ToResponse()));
        }

        [Authorize]
        [HttpPost(ApiRoutes.MovieReviews.Update)]
        public async Task<IActionResult> Update(string movieReviewId, MovieReviewRequest movieReviewRequest)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var movieReview = await _movieReviewService.GetMovieReviewById(movieReviewId);

            if (movieReview.AuthorId != userId && !User.IsInRole("SuperAdmin"))
            {
                return Unauthorized();
            }

            var movieReviewEntity = await _movieReviewService.UpdateMovieReview(movieReviewId, movieReviewRequest.ToDomain());

            return Ok(movieReviewEntity.ToResponse());
        }

        [Authorize]
        [HttpDelete(ApiRoutes.MovieReviews.Delete)]
        public async Task<IActionResult> Delete(string movieReviewId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var movieReview = await _movieReviewService.GetMovieReviewById(movieReviewId);

            if (movieReview.AuthorId != userId && !User.IsInRole("SuperAdmin"))
            {
                return Unauthorized();
            }

            var movieReviewEntity = await _movieReviewService.DeleteMovieReview(movieReviewId);

            return Ok(movieReviewEntity.ToResponse());
        }
    }
}
