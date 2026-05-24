using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PowerStore.Api.Services;
using PowerStore.API.Extensions;
using PowerStore.API.Helpers;
using PowerStore.Application.DTOs;
using PowerStore.Application.DTOs.Auth;
using PowerStore.Application.Interfaces;

namespace PowerStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IWebHostEnvironment _environment;
    private readonly INewsletterService _nlService;

    public AuthController(IAuthService authService, IWebHostEnvironment environment, INewsletterService nlService)
    {
        _authService = authService;
        _environment = environment;
        _nlService = nlService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto dto)
    {
        var result = await _authService.RegisterAsync(dto, GetIpAddress());
        SetRefreshCookie(result);
        return Ok(ToClientResponse(result));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto dto)
    {
        var result = await _authService.LoginAsync(dto, GetIpAddress());
        SetRefreshCookie(result);
        return Ok(ToClientResponse(result));
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> Refresh()
    {
        var refreshToken = RefreshTokenCookieHelper.GetRefreshTokenFromRequest(Request);
        if (string.IsNullOrWhiteSpace(refreshToken))
            return Unauthorized(new { message = "Refresh token is missing" });

        var result = await _authService.RefreshAsync(refreshToken, GetIpAddress());
        SetRefreshCookie(result);
        return Ok(ToClientResponse(result));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = User.GetUserId();
        var refreshToken = RefreshTokenCookieHelper.GetRefreshTokenFromRequest(Request);

        await _authService.LogoutAsync(userId, refreshToken, GetIpAddress());
        RefreshTokenCookieHelper.ClearRefreshTokenCookie(Response, _environment);

        return Ok(new { message = "Logged out successfully" });
    }

    [Authorize]
    [HttpPost("logout-all")]
    public async Task<IActionResult> LogoutAll()
    {
        var userId = User.GetUserId();

        await _authService.LogoutAllAsync(userId, GetIpAddress());
        RefreshTokenCookieHelper.ClearRefreshTokenCookie(Response, _environment);

        return Ok(new { message = "Logged out from all devices successfully" });
    }

    private void SetRefreshCookie(AuthResponseDto result)
    {
        if (!string.IsNullOrWhiteSpace(result.RefreshToken))
            RefreshTokenCookieHelper.SetRefreshTokenCookie(Response, result.RefreshToken, _environment);
    }

    private static AuthResponseDto ToClientResponse(AuthResponseDto result)
    {
        return new AuthResponseDto
        {
            AccessToken = result.AccessToken,
            Email = result.Email,
            ExpiresIn = result.ExpiresIn
        };
    }

    private string? GetIpAddress()
    {
        if (Request.Headers.TryGetValue("X-Forwarded-For", out var forwarded))
            return forwarded.FirstOrDefault()?.Split(',')[0].Trim();

        return HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();
    }

    [HttpPost("subscribe-newsletter")]
    public async Task<IActionResult> SubscribeNewsletter([FromBody] SubscribeNewsletterDto dto)
    {
        var (isSuccess, message) = await _nlService.SubscribeAsync(dto);

        if (!isSuccess) return BadRequest(new { message });

        return Ok(new { message });
    }
}
