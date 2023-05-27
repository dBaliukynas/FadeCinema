using FadeCinema.Services;
using FadeCinema.Settings;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using FadeCinema.Data;
using FadeCinema.Domain;
using System;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Configuration;
using FadeCinema.Tokens;
using Stripe;

namespace FadeCinema
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add services to the container.

            var connectionString = Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));
            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();


            services.AddAuth(Configuration);
            var mapboxAccessTokenSection = Configuration.GetSection("MapboxAccessToken");
            var jwtSettings = mapboxAccessTokenSection.Get<MapboxAccessToken>();
            services.Configure<MapboxAccessToken>(mapboxAccessTokenSection);

            var stripeSettingsSection = Configuration.GetSection("StripeSettings");
            var stripeSettings = stripeSettingsSection.Get<StripeSettings>();
            StripeConfiguration.ApiKey = stripeSettings.Token;

            services.AddScoped<ICinemaService, CinemaService>();
            services.AddScoped<IAuditoriumService, AuditoriumService>();
            services.AddScoped<IMovieService, MovieService>();
            services.AddScoped<ITicketCategoryService, TicketCategoryService>();
            services.AddScoped<IBlobStorageService, BlobStorageService>();
            services.AddScoped<IScreeningService, ScreeningService>();
            services.AddScoped<IPurchasedTicketService, PurchasedTicketService>();
            services.AddScoped<IMovieReviewService, MovieReviewService>();

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddSwagger();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }


            var swaggerSettings = new SwaggerSettings();
            Configuration.Bind(nameof(SwaggerSettings), swaggerSettings);

            app.UseSwagger(options => { options.RouteTemplate = swaggerSettings.JsonRoute; });

            app.UseSwaggerUI(options => options.SwaggerEndpoint(swaggerSettings.UIEndpoint, swaggerSettings.Name));

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
