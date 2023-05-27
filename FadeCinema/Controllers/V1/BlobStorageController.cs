using FadeCinema.Domain;
using FadeCinema.Models.V1.Responses;
using FadeCinema.Routes.V1;
using FadeCinema.Services;
using FadeCinema.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FadeCinema.Controllers.V1
{
    [ApiController]
    public class BlobStorageController : Controller
    {
        private readonly IBlobStorageService _blobStorageService;
        private readonly string _connectionString;
        private readonly string _containerName;
        public BlobStorageController(IBlobStorageService blobStorageService, IConfiguration configuration)
        {
            _blobStorageService = blobStorageService;
            var blobStorageSettingsSection = configuration.GetSection("BlobStorageSettings");
            var blobStorageSettings = blobStorageSettingsSection.Get<BlobStorageSettings>();

            _connectionString = blobStorageSettings.ConnectionString;
            _containerName = blobStorageSettings.ContainerName;
        }

        [HttpGet(ApiRoutes.Blobs.GetByEntityId)]
        public async Task<IActionResult> GetFilesByEntityId(string entityId)
        {
            var files = await _blobStorageService.GetFilesByEntityId(entityId);

            return Ok(files.Select(file => file.ToResponse()));
        }
        [HttpGet(ApiRoutes.Blobs.GetByEntityName)]
        public async Task<IActionResult> GetFilesByEntityName(string entityName)
        {
            var files = await _blobStorageService.GetFilesByEntityName(entityName);

            return Ok(files.Select(file => file.ToResponse()));
        }

        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpPost(ApiRoutes.Blobs.Create)]
        public async Task<IActionResult> CreateFiles(string entityId, [FromForm] List<IFormFile> files,
            [FromHeader(Name = "Path")] string path, [FromHeader(Name = "Entity-Name")] string entityName)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;


            var fileUploadResponse = await _blobStorageService.UploadBlobs(_connectionString, _containerName, files, path, entityName, entityId, userId);

            if (fileUploadResponse.ErrorMessages != null)
            {
                return BadRequest(fileUploadResponse.ErrorMessages);
            }

            return Ok();

        }

        [Authorize(Roles = ApplicationRoles.SuperAdmin)]
        [HttpDelete(ApiRoutes.Blobs.Delete)]
        public async Task<bool> DeleteFiles(string entityId, [FromHeader(Name = "Path")] string path)
        {
            await _blobStorageService.DeleteBlobs(_connectionString, _containerName, entityId, path);

            return true;
        }
    }
}
