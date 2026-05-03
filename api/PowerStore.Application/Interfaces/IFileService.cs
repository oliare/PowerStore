using Microsoft.AspNetCore.Http;

namespace PowerStore.Application.Interfaces;
public interface IFileService
{
    Task<string> SaveFileAsync(IFormFile file, string folderName);
    void DeleteFile(string fileName, string folderName);
}