namespace PowerStore.Domain.Entities;

public class CategoryEntity : AuditableEntityBase
{
    public required string Name { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; private set; }
    public bool IsActive { get; private set; } = true;
    public CategoryEntity? Parent { get; private set; }
    public ICollection<CategoryEntity> Childrens { get; set; } = [];
    public virtual ICollection<ProductEntity> Products { get; set; } = [];
}
