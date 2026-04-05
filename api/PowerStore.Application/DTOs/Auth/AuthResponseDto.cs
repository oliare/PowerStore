namespace PowerStore.Application.DTOs.Auth;

public class AuthResponseDto
{
    public required string AccessToken { get; set; }
    public required string Email { get; set; }
}
