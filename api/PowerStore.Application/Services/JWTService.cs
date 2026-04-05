using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PowerStore.Application.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PowerStore.Application.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;
    private readonly JwtSecurityTokenHandler _jwtTokenHandler;

    public JwtService(IConfiguration config)
    {
        _config = config;
        _jwtTokenHandler = new JwtSecurityTokenHandler();
    }

    public List<Claim> GetClaims(Guid userId, string email, IEnumerable<string> roles)
    {
        var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                new(ClaimTypes.Email, email),
            };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        return claims;
    }

    public string GenerateJwtToken(List<Claim> claims)
    {
        var jwtKey = _config["Jwt:Key"]
            ?? throw new Exception("JWT Key not configured");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["Jwt:ExpiresMinutes"]!)),
            signingCredentials: creds
        );

        return _jwtTokenHandler.WriteToken(token);
    }
}