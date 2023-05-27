using FadeCinema.Domain;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace FadeCinema.Services
{
    public interface IIdentityService
    {
        Task<AuthenticationResult> RegisterAsync(string username, string email, string password);
        Task<AuthenticationResult> LoginAsync(string email, string password);
    }
}
