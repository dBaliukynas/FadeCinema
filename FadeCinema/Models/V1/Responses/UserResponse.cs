using FadeCinema.Domain;

namespace FadeCinema.Models.V1.Responses
{
    public class UserResponse
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }

    }

    public static class ApplicationUserExtensions
    {
        public static UserResponse ToResponse(this ApplicationUser user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.UserName
            };
            
        }
    }
}
