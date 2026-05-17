namespace PowerStore.Application.Exceptions;

public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message = "Unauthorized")
        : base(message, code: "UNAUTHORIZED")
    {
    }
}
