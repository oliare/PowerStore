namespace PowerStore.Application.Exceptions;

public class AppException : Exception
{
    public string? FieldName { get; }
    public string? Code { get; }

    public AppException(string message, string? fieldName = null, string? code = null)
        : base(message)
    {
        FieldName = fieldName;
        Code = code;
    }
}