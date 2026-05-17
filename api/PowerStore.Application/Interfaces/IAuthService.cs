using PowerStore.Application.DTOs.Auth;

namespace PowerStore.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto, string? ipAddress);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto dto, string? ipAddress);
    Task<AuthResponseDto> RefreshAsync(string refreshToken, string? ipAddress);
    Task LogoutAsync(Guid userId, string? refreshToken, string? ipAddress);
    Task LogoutAllAsync(Guid userId, string? ipAddress);
}
