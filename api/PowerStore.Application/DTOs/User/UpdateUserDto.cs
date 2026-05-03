using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace PowerStore.Application.DTOs.User;

public class UpdateUserDto
{
    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public IFormFile? ImageFile { get; set; }
}
