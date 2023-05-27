using FadeCinema.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FadeCinema.Models.V1.Responses
{
    public class FileResponse
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public string EntityId { get; set; }
        public string Url { get; set; }
        public string EntityName { get; set; }

        public UserResponse User { get; set; }
    }

    public static class FileExtensions
    {
        public static FileResponse ToResponse(this Domain.File file)
        {
            return new FileResponse
            {
                Id = file.Id,
                AuthorId = file.AuthorId,
                EntityId = file.EntityId,
                EntityName = file.EntityName,
                Url = file.Url,
                User = file.User.ToResponse(),
            };

        }
    }
}

