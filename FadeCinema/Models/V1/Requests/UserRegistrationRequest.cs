using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace FadeCinema.Models.V1.Requests
{
    public class UserRegistrationRequest
    {
        [Required]
        [JsonPropertyName("username")]
        public string UserName { get; set; }
        [Required]
        [EmailAddress]
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [Required]
        [JsonPropertyName("password")]
        public string Password { get; set; }
    }
}
