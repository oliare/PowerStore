using System.ComponentModel.DataAnnotations;

namespace PowerStore.Domain.Entities;

public class ProductEntity : AuditableEntityBase
{
    [StringLength(200)]
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public double? Rate { get; set; }
    public int StockQuantity { get; set; }
    public decimal? Discount { get; set; }

    public Guid CategoryId { get; set; }
    public CategoryEntity Category { get; set; }
    public virtual ICollection<ProductImageEntity> Images { get; set; } = [];
    public ICollection<FavoriteEntity> Favorites { get; set; } = [];
}