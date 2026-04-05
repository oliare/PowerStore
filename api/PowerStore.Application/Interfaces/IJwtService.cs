using System.Security.Claims;

namespace PowerStore.Application.Interfaces;

public interface IJwtService
{
    List<Claim> GetClaims(Guid userId, string email, IEnumerable<string> roles);
    string GenerateJwtToken(List<Claim> claims);
}
