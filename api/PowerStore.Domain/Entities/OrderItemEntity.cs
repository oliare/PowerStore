namespace PowerStore.Domain.Entities;

public class OrderItemEntity : AuditableEntityBase
{
    public Guid OrderId { get; set; }
    public OrderEntity Order { get; set; }

    public Guid ProductId { get; set; }
    public ProductEntity Product { get; set; }

    public int Quantity { get; set; }
    public decimal Price { get; set; }
}
