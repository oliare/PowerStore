namespace PowerStore.Domain;

public class Roles
{
    public const string Admin = "Admin";
    public const string User = "User";

    public static readonly string[] All = [User, Admin];
}
