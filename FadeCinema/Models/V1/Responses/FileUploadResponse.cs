using System.Collections.Generic;

namespace FadeCinema.Models.V1.Responses
{
    public class FileUploadResponse
    {
        public bool Success { get; set; }
        public IEnumerable<string> ErrorMessages { get; set; }
    }
}
