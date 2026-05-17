namespace PowerStore.API.Helpers;

public static class RefreshTokenCookieHelper
{
    public const string CookieName = "refreshToken";

    public static void SetRefreshTokenCookie(HttpResponse response, string refreshToken, IWebHostEnvironment environment)
    {
        response.Cookies.Append(CookieName, refreshToken, BuildCookieOptions(environment));
    }

    public static void ClearRefreshTokenCookie(HttpResponse response, IWebHostEnvironment environment)
    {
        response.Cookies.Delete(CookieName, BuildCookieOptions(environment));
    }

    public static string? GetRefreshTokenFromRequest(HttpRequest request)
    {
        return request.Cookies[CookieName];
    }

    private static CookieOptions BuildCookieOptions(IWebHostEnvironment environment)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = !environment.IsDevelopment(),
            SameSite = environment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.Strict,
            Path = "/api/Auth",
            IsEssential = true
        };
    }
}
