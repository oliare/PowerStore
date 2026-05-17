using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using PowerStore.Application.DTOs.Auth;
using PowerStore.Application.Exceptions;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;
using System.Security.Cryptography;
using System.Text;

namespace PowerStore.Application.Services;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly IRepository<RefreshTokenEntity> _refreshTokenRepository;
    private readonly UserManager<UserEntity> _userManager;
    private readonly IJwtService _jwtService;
    private readonly IConfiguration _configuration;

    public RefreshTokenService(
        IRepository<RefreshTokenEntity> refreshTokenRepository,
        UserManager<UserEntity> userManager,
        IJwtService jwtService,
        IConfiguration configuration)
    {
        _refreshTokenRepository = refreshTokenRepository;
        _userManager = userManager;
        _jwtService = jwtService;
        _configuration = configuration;
    }

    public async Task<(RefreshTokenEntity Entity, string PlainToken)> CreateAsync(
        Guid userId,
        string? ipAddress,
        Guid? existingFamilyId = null)
    {
        var plainToken = GeneratePlainToken();
        var entity = new RefreshTokenEntity
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = HashToken(plainToken),
            TokenFamilyId = existingFamilyId ?? Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(GetRefreshTokenDays()),
            CreatedByIp = ipAddress
        };

        await _refreshTokenRepository.AddAsync(entity);
        await _refreshTokenRepository.SaveAsync();

        return (entity, plainToken);
    }

    public async Task<AuthResponseDto> RotateAsync(string plainRefreshToken, string? ipAddress)
    {
        var storedToken = await FindByPlainTokenAsync(plainRefreshToken);

        if (storedToken == null)
            throw new UnauthorizedException("Invalid refresh token");

        if (storedToken.IsRevoked)
        {
            await RevokeTokenFamilyAsync(storedToken.TokenFamilyId);
            throw new UnauthorizedException("Refresh token reuse detected");
        }

        if (storedToken.IsExpired)
        {
            storedToken.RevokedAt = DateTime.UtcNow;
            _refreshTokenRepository.Update(storedToken);
            await _refreshTokenRepository.SaveAsync();
            throw new UnauthorizedException("Refresh token expired");
        }

        var user = await _userManager.FindByIdAsync(storedToken.UserId.ToString());
        if (user == null)
            throw new UnauthorizedException("User not found");

        var (newEntity, newPlainToken) = await CreateAsync(
            storedToken.UserId,
            ipAddress,
            storedToken.TokenFamilyId);

        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.ReplacedByTokenId = newEntity.Id;
        _refreshTokenRepository.Update(storedToken);
        await _refreshTokenRepository.SaveAsync();

        var roles = await _userManager.GetRolesAsync(user);
        var claims = _jwtService.GetClaims(user.Id, user.Email!, roles);
        var accessToken = _jwtService.GenerateJwtToken(claims);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            Email = user.Email!,
            ExpiresIn = GetAccessTokenSeconds(),
            RefreshToken = newPlainToken
        };
    }

    public async Task RevokeAsync(string plainRefreshToken, string? ipAddress)
    {
        var storedToken = await FindByPlainTokenAsync(plainRefreshToken);

        if (storedToken == null || storedToken.IsRevoked)
            return;

        storedToken.RevokedAt = DateTime.UtcNow;
        _refreshTokenRepository.Update(storedToken);
        await _refreshTokenRepository.SaveAsync();
    }

    public async Task RevokeAllForUserAsync(Guid userId, string? ipAddress)
    {
        var activeTokens = await _refreshTokenRepository.WhereAsync(
            t => t.UserId == userId && t.RevokedAt == null);

        foreach (var token in activeTokens)
        {
            token.RevokedAt = DateTime.UtcNow;
            _refreshTokenRepository.Update(token);
        }

        if (activeTokens.Count > 0)
            await _refreshTokenRepository.SaveAsync();
    }

    private async Task<RefreshTokenEntity?> FindByPlainTokenAsync(string plainToken)
    {
        var hash = HashToken(plainToken);
        return await _refreshTokenRepository.FirstOrDefaultAsync(t => t.TokenHash == hash);
    }

    private async Task RevokeTokenFamilyAsync(Guid familyId)
    {
        var familyTokens = await _refreshTokenRepository.WhereAsync(
            t => t.TokenFamilyId == familyId && t.RevokedAt == null);

        foreach (var token in familyTokens)
        {
            token.RevokedAt = DateTime.UtcNow;
            _refreshTokenRepository.Update(token);
        }

        if (familyTokens.Count > 0)
            await _refreshTokenRepository.SaveAsync();
    }

    private static string GeneratePlainToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    private static string HashToken(string plainToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(plainToken));
        return Convert.ToBase64String(bytes);
    }

    private int GetRefreshTokenDays() =>
        int.Parse(_configuration["Jwt:RefreshTokenDays"] ?? "14");

    private int GetAccessTokenSeconds() =>
        int.Parse(_configuration["Jwt:AccessTokenMinutes"] ?? _configuration["Jwt:ExpiresMinutes"] ?? "15") * 60;
}
