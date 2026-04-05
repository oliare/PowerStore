using PowerStore.Application.DTOs.Auth;

namespace PowerStore.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
    //Task LogoutAsync(Guid userId);
}

