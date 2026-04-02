using Microsoft.AspNetCore.Identity;

namespace PowerStore.Domain.Entities;

public class RoleEntity : IdentityRole<Guid>
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
}
