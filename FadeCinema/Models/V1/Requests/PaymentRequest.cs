using Duende.IdentityServer.Models;
using FadeCinema.Domain;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Requests
{
    public class PaymentRequest
    {
        public string ScreeningId { get; set; }
        [JsonPropertyName("selectedSeats")]
        public ScreeningSeatRequest[] SelectedSeats { get; set; }
    }
}
