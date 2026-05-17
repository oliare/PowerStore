using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using PowerStore.Application.DTOs.Auth;
using PowerStore.Application.Exceptions;
using PowerStore.Application.Interfaces;
using PowerStore.Domain;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Services;

public class AuthService : IAuthService
{
    private readonly IMapper _mapper;
    private readonly IJwtService _jwtService;
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly UserManager<UserEntity> _userManager;
    private readonly IConfiguration _configuration;

    public AuthService(
        IMapper mapper,
        IJwtService jwtService,
        IRefreshTokenService refreshTokenService,
        UserManager<UserEntity> userManager,
        IConfiguration configuration)
    {
        _mapper = mapper;
        _jwtService = jwtService;
        _refreshTokenService = refreshTokenService;
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto, string? ipAddress)
    {
        var exists = await _userManager.FindByEmailAsync(dto.Email);
        if (exists != null)
            throw new EmailExistsException(dto.Email, "email");

        var user = _mapper.Map<UserEntity>(dto);
        user.UserName = Guid.NewGuid().ToString("N");

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

        await _userManager.AddToRoleAsync(user, Roles.User);

        return await BuildAuthResponseAsync(user, ipAddress);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto, string? ipAddress)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            throw new UnauthorizedException("Invalid credentials");

        return await BuildAuthResponseAsync(user, ipAddress);
    }

    public Task<AuthResponseDto> RefreshAsync(string refreshToken, string? ipAddress)
    {
        return _refreshTokenService.RotateAsync(refreshToken, ipAddress);
    }

    public async Task LogoutAsync(Guid userId, string? refreshToken, string? ipAddress)
    {
        if (!string.IsNullOrWhiteSpace(refreshToken))
            await _refreshTokenService.RevokeAsync(refreshToken, ipAddress);
    }

    public Task LogoutAllAsync(Guid userId, string? ipAddress)
    {
        return _refreshTokenService.RevokeAllForUserAsync(userId, ipAddress);
    }

    private async Task<AuthResponseDto> BuildAuthResponseAsync(UserEntity user, string? ipAddress)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var claims = _jwtService.GetClaims(user.Id, user.Email!, roles);
        var accessToken = _jwtService.GenerateJwtToken(claims);

        var (_, plainRefreshToken) = await _refreshTokenService.CreateAsync(user.Id, ipAddress);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            Email = user.Email!,
            ExpiresIn = GetAccessTokenSeconds(),
            RefreshToken = plainRefreshToken
        };
    }

    private int GetAccessTokenSeconds() =>
        int.Parse(_configuration["Jwt:AccessTokenMinutes"] ?? _configuration["Jwt:ExpiresMinutes"] ?? "15") * 60;
}
