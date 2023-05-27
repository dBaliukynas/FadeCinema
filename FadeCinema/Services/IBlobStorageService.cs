using FadeCinema.Models.V1.Responses;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace FadeCinema.Services
{
    public interface IBlobStorageService
    {
        public Task<FileUploadResponse> UploadBlobs(string connectionString, string containerName, List<IFormFile> files, string path,
            string entityName, string entityId, string userId);
        public Task<bool> DeleteBlobs(string connectionString, string containerName, string entityId, string path);
        public Task<List<Domain.File>> GetFilesByEntityId(string entityId);
        public Task<List<Domain.File>> GetFilesByEntityName(string entityName);
    }
}
