using AutoMapper;
using Microsoft.AspNetCore.Identity;
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
    private readonly UserManager<UserEntity> _userManager;

    public AuthService(IMapper mapper, IJwtService jwtService, UserManager<UserEntity> userManager)
    {
        _mapper = mapper;
        _jwtService = jwtService;
        _userManager = userManager;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
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

        var roles = await _userManager.GetRolesAsync(user);

        var claims = _jwtService.GetClaims(user.Id, user.Email!, roles);
        var token = _jwtService.GenerateJwtToken(claims);

        return new AuthResponseDto
        {
            AccessToken = token,
            Email = user.Email
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            throw new Exception("Invalid credentials");

        var roles = await _userManager.GetRolesAsync(user);

        var claims = _jwtService.GetClaims(user.Id, user.Email!, roles);
        var token = _jwtService.GenerateJwtToken(claims);

        return new AuthResponseDto
        {
            AccessToken = token,
            Email = user.Email
        };
    }

    public Task LogoutAsync(Guid userId)
    {
        return Task.CompletedTask;
    }
}