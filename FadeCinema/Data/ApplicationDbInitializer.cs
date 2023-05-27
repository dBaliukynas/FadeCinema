using FadeCinema.Domain;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace FadeCinema.Data
{
    public static class ApplicationDbInitializer
    {
        public static async Task InitializeRolesAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            var superAdminRoleExists = await roleManager.RoleExistsAsync(ApplicationRoles.SuperAdmin);

            if (!superAdminRoleExists)
            {
                var role = new IdentityRole();
                role.Name = ApplicationRoles.SuperAdmin;
                await roleManager.CreateAsync(role);
            }
        }

        public static async Task InitializeSuperAdminUserAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            var configuration = serviceProvider.GetRequiredService<IConfiguration>();

            var superAdmin = await userManager
                        .FindByEmailAsync(configuration["SuperAdminCredentials:Email"]);


            if (superAdmin == null)
            {
                superAdmin = new ApplicationUser();
                superAdmin.UserName = configuration["SuperAdminCredentials:UserName"];
                superAdmin.Email = configuration["SuperAdminCredentials:Email"];

                string password = configuration["SuperAdminCredentials:Password"];

                IdentityResult identityResult = await userManager.CreateAsync(superAdmin, password);

                if (identityResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(superAdmin, ApplicationRoles.SuperAdmin);
                }
            }
    
        }
    }
}
