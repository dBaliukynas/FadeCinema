using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using FadeCinema.Domain;
using Microsoft.AspNetCore.Identity;

namespace FadeCinema.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {

        }
        public DbSet<Cinema> Cinemas { get; set; }
        public DbSet<Auditorium> Auditoriums { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<TicketCategory> TicketCategories { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<Screening> Screenings { get; set; }
        public DbSet<ScreeningSeat> ScreeningSeats { get; set; }
        public DbSet<PurchasedTicket> PurchasedTickets { get; set; }
        public DbSet<PurchasedTicketHistory> PurchasedTicketHistory { get; set; }
        public DbSet<MovieReview> MovieReviews { get; set; }
        public DbSet<MovieReviewHistory> MovieReviewHistory { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Cinema>().ToTable("Cinemas");
            modelBuilder.Entity<Auditorium>().ToTable("Auditoriums");
            modelBuilder.Entity<Seat>().ToTable("Seats");
            modelBuilder.Entity<Movie>().ToTable("Movies");
            modelBuilder.Entity<TicketCategory>().ToTable("TicketCategories");
            modelBuilder.Entity<File>().ToTable("Files");
            modelBuilder.Entity<Screening>().ToTable("Screenings");
            modelBuilder.Entity<ScreeningSeat>().ToTable("ScreeningSeats");
            modelBuilder.Entity<PurchasedTicket>().ToTable("PurchasedTickets");
            modelBuilder.Entity<PurchasedTicketHistory>().ToTable("PurchasedTicketHistory");
            modelBuilder.Entity<MovieReview>().ToTable("MovieReviews");
            modelBuilder.Entity<MovieReviewHistory>().ToTable("MovieReviewHistory");
        }
    }
}