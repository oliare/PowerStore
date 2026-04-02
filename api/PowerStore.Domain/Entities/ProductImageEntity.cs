namespace PowerStore.Domain.Entities;

public class ProductImageEntity : AuditableEntityBase
{
    public string? Image { get; set; }
    public short DisplayOrder { get; set; }
    public Guid ProductId { get; set; }
    public ProductEntity Product { get; set; }
}
