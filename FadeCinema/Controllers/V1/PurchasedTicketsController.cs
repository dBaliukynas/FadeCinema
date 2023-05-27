using FadeCinema.Domain;
using FadeCinema.Models.V1.Requests;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Routes.V1;
using FadeCinema.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FadeCinema.Controllers.V1
{
    [ApiController]
    public class PurchasedTicketsController : Controller
    {
        private readonly IPurchasedTicketService _purchasedTicketService;
        public PurchasedTicketsController(IPurchasedTicketService purchasedTicketService)
        {
            _purchasedTicketService = purchasedTicketService;
        }
        [Authorize]
        [HttpGet(ApiRoutes.PurchasedTickets.GetByScreeningId)]
        public async Task<IActionResult> GetByScreeningId(string screeningId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var purchasedTickets = await _purchasedTicketService.GetPurchasedTicketsByScreeningId(screeningId, userId);

            return Ok(purchasedTickets.Select(purchasedTicket => purchasedTicket.ToResponse()));
        }

        [Authorize]
        [HttpGet(ApiRoutes.PurchasedTickets.GetAll)]
        public async Task<IActionResult> GetAll([FromQuery] int page)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var (purchasedTickets, hasMore) = await _purchasedTicketService.GetPurchasedTickets(page, userId);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(purchasedTickets.Select(purchasedTicket => purchasedTicket.ToResponse()));
        }
        [Authorize]
        [HttpGet(ApiRoutes.PurchasedTickets.GetHistoryAll)]
        public async Task<IActionResult> GetHistoryAll([FromQuery] int page)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var (purchasedTicketHistory, hasMore) = await _purchasedTicketService.GetPurchasedTicketHistory(page, userId);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(purchasedTicketHistory.Select(purchasedTicketHistoryItem => purchasedTicketHistoryItem.ToResponse()));
        }
    }
}
