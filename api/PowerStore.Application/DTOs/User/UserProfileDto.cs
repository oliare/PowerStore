namespace PowerStore.Application.DTOs.User;

public class UserProfileDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Image { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? BirthDate { get; set; }
    public bool IsDeleted { get; set; }
}
