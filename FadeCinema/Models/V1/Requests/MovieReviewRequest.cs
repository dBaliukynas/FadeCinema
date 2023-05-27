using FadeCinema.Domain;
using System.Diagnostics.Metrics;
using System.IO;

namespace FadeCinema.Models.V1.Requests
{
    public class MovieReviewRequest
    {
        public MovieReview ToDomain()
        {
            return new MovieReview
            {
                Rating = Rating,
                Description = Description,
            };
        }

        public int Rating { get; set; }
        public string Description { get; set; }
    }
}
