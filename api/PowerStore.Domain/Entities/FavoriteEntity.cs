namespace PowerStore.Domain.Entities;

public class FavoriteEntity : AuditableEntityBase
{
    public Guid UserId { get; set; }
    public UserEntity? User { get; set; }

    public Guid ProductId { get; set; }
    public ProductEntity? Product { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
