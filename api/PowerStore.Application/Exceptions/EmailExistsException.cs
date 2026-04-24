namespace PowerStore.Application.Exceptions;

public class EmailExistsException : AppException
{
    public EmailExistsException(string email, string field)
        : base(
            message: $"Email {email} вже зайнятий",
            fieldName: field)
    {
    }
}