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
    public class TicketCategoriesController : Controller
    {
        private readonly ITicketCategoryService _ticketCategoryService;
        public TicketCategoriesController(ITicketCategoryService ticketCategoryService)
        {

            _ticketCategoryService = ticketCategoryService;
        }
        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpPost(ApiRoutes.TicketCategories.Create)]
        public async Task<IActionResult> Create(TicketCategoryRequest ticketCategoryRequest)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var ticketCategory = await _ticketCategoryService.CreateTicketCategory(ticketCategoryRequest.ToDomain(), userId);

            return Ok(ticketCategory.ToResponse());
        }

        [HttpGet(ApiRoutes.TicketCategories.Get)]
        public async Task<IActionResult> Get(string ticketCategoryId)
        {
            var ticketCategory = await _ticketCategoryService.GetTicketCategoryById(ticketCategoryId);

            return Ok(ticketCategory.ToResponse());
        }

        [HttpGet(ApiRoutes.TicketCategories.GetAll)]
        public async Task<IActionResult> GetAll([FromQuery] int page)
        {
            var (ticketCategories, hasMore) = await _ticketCategoryService.GetTicketCategories(page);
            Response.Headers.Add("hasMore", hasMore.ToString());

            return Ok(ticketCategories.Select(ticketCategory => ticketCategory.ToResponse()));
        }
        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpPost(ApiRoutes.TicketCategories.Update)]
        public async Task<IActionResult> Update(string ticketCategoryId, TicketCategoryRequest ticketCategoryRequest)
        {
            var ticketCategory = await _ticketCategoryService.UpdateTicketCategory(ticketCategoryId, ticketCategoryRequest.ToDomain());

            return Ok(ticketCategory.ToResponse());
        }
        [HttpDelete(ApiRoutes.TicketCategories.Delete)]
        public async Task<IActionResult> Delete(string ticketCategoryId)
        {
            var ticketCategoryResponse = await _ticketCategoryService.DeleteTicketCategory(ticketCategoryId);

            if (ticketCategoryResponse.ErrorMessages != null)
            {
                return BadRequest(ticketCategoryResponse.ErrorMessages);
            }


            return Ok(ticketCategoryResponse);
        }
    }
}
