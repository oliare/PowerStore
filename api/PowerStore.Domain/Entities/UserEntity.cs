using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace PowerStore.Domain.Entities;

public class UserEntity : IdentityUser<Guid>
{
    [StringLength(75)]
    public string? FirstName { get; set; }

    [StringLength(75)]
    public string? LastName { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? BirthDate { get; set; }
    public bool IsDeleted { get; set; }
    public string? Image { get; set; }

    public virtual ICollection<OrderEntity> Orders { get; set; } = [];
    public ICollection<CartEntity> Carts { get; set; } = [];
    public ICollection<FavoriteEntity> Favorites { get; set; } = [];
}
