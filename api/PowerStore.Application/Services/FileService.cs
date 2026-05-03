using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using PowerStore.Application.Interfaces;
using PowerStore.Application.DTOs;

namespace PowerStore.Application.Services;

public class FileService : IFileService
{
    private readonly string _basePath;
    private readonly long _maxFileSize = 5 * 1024 * 1024;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };

    public FileService(IHostEnvironment environment, IOptions<FileStorageSettings> settings)
    {
        _basePath = Path.GetFullPath(Path.Combine(environment.ContentRootPath, settings.Value.UploadsRoot));
    }

    public async Task<string> SaveFileAsync(IFormFile file, string folderName)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("Файл не вибрано або він порожній.");
        }

        if (file.Length > _maxFileSize)
        {
            throw new ArgumentException("Розмір файлу перевищує дозволені 5 МБ.");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
        {
            throw new ArgumentException($"Тип файлу {extension} не підтримується. Дозволені: jpg, jpeg, png, webp.");
        }

        string targetFolder = Path.Combine(_basePath, folderName);

        if (!Directory.Exists(targetFolder))
        {
            Directory.CreateDirectory(targetFolder);
        }

        string fileName = Guid.NewGuid().ToString() + extension;
        string filePath = Path.Combine(targetFolder, fileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        return Path.Combine(folderName, fileName).Replace("\\", "/");
    }

    public void DeleteFile(string fileRelativePath, string folderName)
    {
        string filePath = Path.GetFullPath(Path.Combine(_basePath, fileRelativePath));

        if (!filePath.StartsWith(_basePath))
        {
            return;
        }

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }
}