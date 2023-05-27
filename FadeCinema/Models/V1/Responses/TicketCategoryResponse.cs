using FadeCinema.Domain;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FadeCinema.Models.V1.Responses
{
    public class TicketCategoryResponse
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public UserResponse User { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("price")]
        public double Price { get; set; }
        public IEnumerable<string> ErrorMessages { get; set; }
    }

    public static class TicketCategoryExtensions
    {
        public static TicketCategoryResponse ToResponse(this TicketCategory ticketCategory)
        {
            return new TicketCategoryResponse
            {
                Id = ticketCategory.Id,
                AuthorId = ticketCategory.AuthorId,
                Name = ticketCategory.Name,
                User = ticketCategory.User.ToResponse(),
                Price = ticketCategory.Price,
            };

        }
    }
}

