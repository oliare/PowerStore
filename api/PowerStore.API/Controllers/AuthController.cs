using Microsoft.AspNetCore.Mvc;
using PowerStore.Application.DTOs.Auth;
using PowerStore.Application.Interfaces;

namespace PowerStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        return Ok(result);
    }

    //[HttpPost("logout")]
    //public async Task<IActionResult> Logout()
    //{
    //    await _authService.LogoutAsync(Guid.Empty);

    //    return NoContent();
    //}
}