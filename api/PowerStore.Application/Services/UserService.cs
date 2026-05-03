using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PowerStore.Application.DTOs.User;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Services;

public class UserService : IUserService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly IFileService _fileService;

    public UserService(UserManager<UserEntity> userManager, IFileService fileService)
    {
        _userManager = userManager;
        _fileService = fileService;
    }

    public async Task<UserProfileDto> GetMeAsync(Guid userId)
    {
        var user = await _userManager.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new KeyNotFoundException($"Користувача з ID {userId} не знайдено");
        }

        return new UserProfileDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            BirthDate = user.BirthDate,
            CreatedAt = user.CreatedDate,
            UpdatedAt = user.UpdatedAt,
            IsDeleted = user.IsDeleted,
            Image = user.Image
        };
    }

    public async Task UpdateProfileAsync(Guid userId, UpdateUserDto updateDto)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) throw new KeyNotFoundException("Користувача не знайдено");

        user.FirstName = updateDto.FirstName;
        user.LastName = updateDto.LastName;
        user.PhoneNumber = updateDto.PhoneNumber;
        user.UpdatedAt = DateTime.UtcNow;

        if (updateDto.ImageFile != null)
        {
            if (!string.IsNullOrEmpty(user.Image))
            {
                _fileService.DeleteFile(user.Image, "avatars");
            }

            user.Image = await _fileService.SaveFileAsync(updateDto.ImageFile, "avatars");
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new Exception("Помилка при оновленні профілю");
        }
    }
}