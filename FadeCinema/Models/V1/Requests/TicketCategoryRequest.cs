using Duende.IdentityServer.Models;
using FadeCinema.Domain;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Requests
{
    public class TicketCategoryRequest
    {
        public TicketCategory ToDomain()
        {
            return new TicketCategory
            {
                Name = Name,
                Price = Price,
            };
        }
        [JsonPropertyName("name")]
        [Required(ErrorMessage = "Ticket's category name cannot be empty.")]
        [StringLength(100, ErrorMessage = "Ticket's category name cannot be longer than 100 characters.")]
        public string Name { get; set; }
        [JsonPropertyName("price")]
        [Range(1.0, 100.0, ErrorMessage = "Price has to be in range from 1 to 100 euros.")]
        public double Price { get; set; }
    }
}
