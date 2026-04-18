using System.Security.Claims;

namespace PowerStore.API.Extensions;

public static class ClaimsPrincipalExtension
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var id = user.FindFirstValue(ClaimTypes.NameIdentifier)
              ?? throw new Exception("UserId (sub) claim not found");

        return Guid.Parse(id);
    }
}