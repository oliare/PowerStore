namespace PowerStore.Domain.Entities;

public class CartEntity : AuditableEntityBase
{
    public Guid ProductId { get; set; }
    public Guid UserId { get; set; }
    public int Quantity { get; set; }

    public virtual ProductEntity? Product { get; set; }
    public virtual UserEntity? User { get; set; }
}