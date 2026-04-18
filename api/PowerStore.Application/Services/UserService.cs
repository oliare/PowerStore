using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PowerStore.Application.DTOs.User;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Services;

public class UserService : IUserService
{
    private readonly UserManager<UserEntity> _userManager;

    public UserService(UserManager<UserEntity> userManager)
    {
        _userManager = userManager;
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
            UpdatedAt = user.UpdatedAt,
            IsDeleted = user.IsDeleted,
            Image = user.Image
        };
    }
}