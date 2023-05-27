using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using FadeCinema.Data;
using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace FadeCinema.Services
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly ApplicationDbContext _dbContext;
        public BlobStorageService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<Domain.File>> GetFilesByEntityName(string entityName)
        {
            var fileEntities = await _dbContext.Files
                .Where(file => file.EntityName == entityName)
                .Include(file => file.User)
                .GroupBy(file => file.EntityId)
                .Select(group => group.First())
                .ToListAsync();

            return fileEntities;
        }

        public async Task<List<Domain.File>> GetFilesByEntityId(string entityId)
        {
            var fileEntities = await _dbContext.Files.Where(file => file.EntityId == entityId).Include(file => file.User).ToListAsync();

            return fileEntities;
        }

        public async Task<FileUploadResponse> UploadBlobs(string connectionString, string containerName, List<IFormFile> files, string path,
            string entityName, string entityId, string userId)
        {

            var container = GetContainer(connectionString, containerName);
            if (!await container.ExistsAsync())
            {
                var blobServiceClient = new BlobServiceClient(connectionString);
                container = blobServiceClient.GetBlobContainerClient(containerName);
            }

            foreach (IFormFile file in files)
            {
                if (file.Length > 10000000)
                {
                    return new FileUploadResponse
                    {
                        ErrorMessages = new[] { "File's size must be less than 10MB." },
                    };
                }

                string fileExtension = Path.GetExtension(file.FileName);
                Stream fileContent = file.OpenReadStream();

                try
                {
                    var isValidImage = Image.FromStream(fileContent);
                }
                catch (Exception e)
                {
                    return new FileUploadResponse
                    {
                        ErrorMessages = new[] { "File must be an image." },
                    };
                }

                var image = Image.FromStream(fileContent);

                if (image.Height < 500)
                {
                    return new FileUploadResponse
                    {
                        ErrorMessages = new[] { "Image's height must be higher than 500px." },
                    };
                }

                if (image.Width < 1300)
                {
                    return new FileUploadResponse
                    {
                        ErrorMessages = new[] { "Image's width must be higher than 1300px." },
                    };
                }


                var blobClient = container.GetBlobClient($"{path}/{file.FileName}");
                if (!blobClient.Exists())
                {
                    fileContent.Position = 0;
                    await container.UploadBlobAsync($"{path}/{file.FileName}", fileContent);

                }
                else
                {
                    fileContent.Position = 0;
                    await blobClient.UploadAsync(fileContent, overwrite: true);
                }

                var fileDomain = new Domain.File
                {
                    AuthorId = userId,
                    EntityId = entityId,
                    EntityName = entityName,
                    Url = $"https://fadecinemablob.blob.core.windows.net/files{path}/{file.FileName}",

                };

                var fileEntity = _dbContext.Add(fileDomain).Entity;
                await _dbContext.SaveChangesAsync();
            }

            return new FileUploadResponse
            {
                Success = true,
            };
        }

        public async Task<bool> DeleteBlobs(string connectionString, string containerName, string entityId, string path)
        {

            var container = GetContainer(connectionString, containerName);
            if (await container.ExistsAsync())
            {
                var blobServiceClient = new BlobServiceClient(connectionString);
                container = blobServiceClient.GetBlobContainerClient(containerName);
            }
            var files = await _dbContext.Files.Where(file => file.EntityId == entityId).ToListAsync();
            var fileMatchingUrl = await _dbContext.Files
                .Where(file => file.EntityId != entityId)
                .FirstOrDefaultAsync(file => files
                .Select(file => file.Url).Contains(file.Url));

            foreach (Domain.File file in files)
            {

                var blobClient = container.GetBlobClient($"{path}/{file.Url.Split('/').Last()}");
                await _dbContext.BulkDeleteAsync(files);
                await _dbContext.BulkSaveChangesAsync();

                if (await blobClient.ExistsAsync() && fileMatchingUrl == null)
                {
                    await blobClient.DeleteIfExistsAsync();
                }
                else
                {
                    return false;
                }
            }

            return true;

        }



        public static BlobContainerClient GetContainer(string connectionString, string containerName)
        {
            var blobServiceClient = new BlobServiceClient(connectionString);
            return blobServiceClient.GetBlobContainerClient(containerName);
        }

    }
}
