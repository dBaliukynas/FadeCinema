namespace FadeCinema.Routes.V1
{
    public static class ApiRoutes
    {

        public const string Root = "api";
        public const string Version = "v1";
        public const string Base = Root + "/" + Version;

        public static class Identity
        {
            public const string Login = Base + "/identity/login";
            public const string Register = Base + "/identity/register";
        }

        public static class Cinemas
        {
            public const string Create = Base + "/cinema";
            public const string Get = Base + "/cinemas/{cinemaId}";
            public const string GetAll = Base + "/cinemas";
            public const string Update = Base + "/cinemas/{cinemaId}";
            public const string Delete = Base + "/cinemas/{cinemaId}";
        }
        public static class Auditoriums
        {
            public const string Create = Base + "/cinemas/{cinemaId}/auditorium";
            public const string Get = Base + "/auditoriums/{auditoriumId}";
            public const string GetAll = Base + "/cinemas/{cinemaId}/auditoriums";
            public const string Update = Base + "/cinemas/{cinemaId}/auditoriums/{auditoriumId}";
            public const string Delete = Base + "/auditoriums/{auditoriumId}";
        }

        public static class Movies
        {
            public const string Create = Base + "/movie";
            public const string Get = Base + "/movies/{movieId}";
            public const string GetAll = Base + "/movies";
            public const string Update = Base + "/movies/{movieId}";
            public const string Delete = Base + "/movies/{movieId}";
            public const string CreateFile = Base + "/movies/file";
        }
        public static class TicketCategories
        {
            public const string Create = Base + "/ticket-category";
            public const string Get = Base + "/ticket-categories/{ticketCategoryId}";
            public const string GetAll = Base + "/ticket-categories";
            public const string Update = Base + "/ticket-categories/{ticketCategoryId}";
            public const string Delete = Base + "/ticket-categories/{ticketCategoryId}";
        }

        public static class Blobs
        {
            public const string Create = Base + "/blobs/{entityId}";
            public const string Delete = Base + "/blobs/{entityId}";
            public const string GetByEntityId = Base + "/blobs/{entityId}";
            public const string GetByEntityName = Base + "/blobs/entities/{entityName}";
        }
        public static class Screenings
        {
            public const string Create = Base + "/screening/{movieId}/{auditoriumId}/{ticketCategoryId}";
            public const string Delete = Base + "/screenings/{screeningId}";
            public const string Get = Base + "/screenings/{screeningId}";
            public const string GetByMovieId = Base + "/screenings/movies/{movieId}";
        }
        public static class Payments
        {
            public const string Create = Base + "/payment";
            public const string CreateTicketEntity = Base + "/ticket-purchase";
        }

        public static class PurchasedTickets
        {
            public const string GetAll = Base + "/purchased-tickets";
            public const string GetByScreeningId = Base + "/purchased-tickets/{screeningId}";
            public const string GetHistoryAll = Base + "/purchased-tickets-history";
        }
        public static class Search
        {
            public const string GetMovies = Base + "/search-movies";
            public const string GetAuditoriums = Base + "/search-auditoriums";
            public const string GetCinemas= Base + "/search-cinemas";
        }
        public static class MovieReviews
        {
            public const string GetByMovieId = Base + "/movie-reviews/{movieId}";
            public const string GetByUserId = Base + "/user/movie-reviews";
            public const string GetHistoryAll = Base + "/movie-reviews-history";
            public const string Create = Base + "/movie-review/{movieId}";
            public const string Update = Base + "/movie-reviews/{movieReviewId}";
            public const string Delete = Base + "/movie-reviews/{movieReviewId}";
        }

    }
}
