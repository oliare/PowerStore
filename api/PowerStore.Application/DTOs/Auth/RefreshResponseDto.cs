namespace PowerStore.Application.DTOs.Auth;

public class RefreshResponseDto
{
    public required string AccessToken { get; set; }
    public required string Email { get; set; }
    public int ExpiresIn { get; set; }
}
