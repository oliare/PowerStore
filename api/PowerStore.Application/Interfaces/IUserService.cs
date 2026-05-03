using PowerStore.Application.DTOs.User;

namespace PowerStore.Application.Interfaces;

public interface IUserService
{
    Task<UserProfileDto> GetMeAsync(Guid userId);
    Task UpdateProfileAsync(Guid userId, UpdateUserDto updateDto);
}
