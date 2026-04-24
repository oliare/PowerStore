using System.Net;
using System.Text.Json;
using PowerStore.Application.Exceptions;

namespace PowerStore.API.Middleware;

public class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception error)
        {
            context.Response.ContentType = "application/json";

            context.Response.StatusCode = error switch
            {
                AppException => (int)HttpStatusCode.BadRequest,
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var appError = error as AppException;

            var result = JsonSerializer.Serialize(new
            {
                message = error.Message,
                field = appError?.FieldName,
                code = appError?.Code
            }
            , new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(result);
        }
    }
}