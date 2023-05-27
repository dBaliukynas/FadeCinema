using FadeCinema.Data;
using FadeCinema.Domain;
using FadeCinema.Models.V1.Requests;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Routes.V1;
using FadeCinema.Services;
using FadeCinema.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting.Internal;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FadeCinema.Controllers.V1
{

    [ApiController]
    public class PaymentsController : Controller
    {
        private readonly string _token;
        private readonly ApplicationDbContext _dbContext;
        private IScreeningService _screeningService;

        public PaymentsController(IConfiguration configuration, ApplicationDbContext dbContext, IScreeningService screeningService)
        {
            _dbContext = dbContext;
            _screeningService = screeningService;
        }


        [Authorize]
        [HttpPost(ApiRoutes.Payments.Create)]
        public async Task<IActionResult> Create(PaymentRequest paymentRequest)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var (screening, entitySeats) = await _screeningService.GetScreeningById(paymentRequest.ScreeningId);

            var purchasedTickets = await _dbContext.PurchasedTickets.Where(purchasedTicket => purchasedTicket.ScreeningSeat.ScreeningId == paymentRequest.ScreeningId).ToListAsync();

            if (purchasedTickets.Count >= 9)
            {
                return new ContentResult() { Content = $"{Request.Scheme}://{Request.Host.Value}/payment-failure", ContentType = "text/plain", StatusCode = 403 };
            }


            string seatIdsUrlEncoded = string.Join(",", paymentRequest.SelectedSeats.Select(selectedSeat => selectedSeat.Id));


            var options = new SessionCreateOptions()
            {
                LineItems = paymentRequest.SelectedSeats.Select(selectedSeat => new SessionLineItemOptions()
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long?)screening.TicketCategory.Price * 100,
                        Currency = "EUR",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = screening.TicketCategory.Name,
                            Description = $"Seat row: {(char)('A' + (selectedSeat.Number != screening.Auditorium.Columns ? selectedSeat.Position / screening.Auditorium.Columns : (selectedSeat.Position / screening.Auditorium.Columns) - 1))}, Seat number: {selectedSeat.Number}",
                        },
                    },
                    Quantity = 1,
                }).ToList(),

                PaymentMethodTypes = new List<string>()
                {
                    "card"
                },
                Mode = "payment",
                SuccessUrl = $"{Request.Scheme}://{Request.Host.Value}/payment-success?session-id={{CHECKOUT_SESSION_ID}}&ticket-category-id={screening.TicketCategoryId}&seat-ids={seatIdsUrlEncoded}",
                CancelUrl = $"{Request.Scheme}://{Request.Host.Value}/payment-failure",
                CustomerEmail = (await _dbContext.Users.FindAsync(userId)).Email,
            };

            var metadata = paymentRequest.SelectedSeats
                .Select((selectedSeat, index) => new { Item = selectedSeat, Index = index })
                .ToDictionary(selectedSeat => $"seatId{selectedSeat.Index}", selectedSeat => selectedSeat.Item.Id);
            options.Metadata = metadata;
            options.Metadata.Add("ticketCategoryId", screening.TicketCategoryId);
            var service = new SessionService();
            var session = await service.CreateAsync(options);
            return Content(session.Url, "text/plain");
        }

        [Authorize]
        [HttpPost(ApiRoutes.Payments.CreateTicketEntity)]
        public async Task<IActionResult> CreateTicketEntity(TicketPurchaseRequest ticketPurchaseRequest)
        {
            var sessionService = new SessionService();
            var session = await sessionService.GetAsync(ticketPurchaseRequest.SessionId);

            if (session == null || session.ExpiresAt < DateTime.UtcNow)
            {
                return StatusCode(401);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var index = 0;

            foreach (var value in session.Metadata.Values)
            {
                if (index != session.Metadata.Count - 1 && value != ticketPurchaseRequest.SeatIds[index])
                {
                    return StatusCode(401);
                }

                if (index == session.Metadata.Count - 1 && value != ticketPurchaseRequest.TicketCategoryId)
                {
                    return StatusCode(401);
                }

                if (index != session.Metadata.Count - 1)
                {
                    var existingTicket = await _dbContext.PurchasedTickets.FirstOrDefaultAsync(existingTicket => existingTicket.ScreeningSeatId == value);

                    if (existingTicket == null)
                    {
                        var purchasedTicket = new PurchasedTicket { };

                        purchasedTicket.AuthorId = userId;
                        purchasedTicket.ScreeningSeatId = ticketPurchaseRequest.SeatIds[index];
                        purchasedTicket.TicketCategoryId = ticketPurchaseRequest.TicketCategoryId;
                        purchasedTicket.ScreeningSeat = await _dbContext.ScreeningSeats
                            .Include(screeningSeat => screeningSeat.Screening)
                            .FirstOrDefaultAsync(screeningSeat => screeningSeat.Id == ticketPurchaseRequest.SeatIds[index]);
                        purchasedTicket.TicketCategoryId = ticketPurchaseRequest.TicketCategoryId;
                        purchasedTicket.TicketCategory = await _dbContext.TicketCategories
                            .FindAsync(purchasedTicket.TicketCategoryId);

                        var entity = _dbContext.Add(purchasedTicket).Entity;
                        var selectedSeat = await _dbContext.ScreeningSeats.FindAsync(value);
                        selectedSeat.IsReserved = true;
                        _dbContext.ScreeningSeats.Update(selectedSeat);
                        await _dbContext.SaveChangesAsync();

                    }
                }

                index++;
            }

            return Ok(ticketPurchaseRequest.SeatIds);
        }

    }
}



