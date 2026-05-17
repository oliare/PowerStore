using PowerStore.Application.DTOs.Auth;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Interfaces;

public interface IRefreshTokenService
{
    Task<(RefreshTokenEntity Entity, string PlainToken)> CreateAsync(
        Guid userId,
        string? ipAddress,
        Guid? existingFamilyId = null);

    Task<AuthResponseDto> RotateAsync(string plainRefreshToken, string? ipAddress);

    Task RevokeAsync(string plainRefreshToken, string? ipAddress);

    Task RevokeAllForUserAsync(Guid userId, string? ipAddress);
}
