using PowerStore.Application.DTOs.ProductImage;

namespace PowerStore.Application.DTOs.Product;

public class ProductDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? Specifications { get; set; }
    public string? Image { get; set; }
    public double? Rate { get; set; }
    public int StockQuantity { get; set; }
    public decimal? Discount { get; set; }
    public string? CategoryName { get; set; }
    public Guid CategoryId { get; set; }
    public bool IsFavorite { get; set; }
    public string? Brand { get; set; }
    public List<string> Tags { get; set; } = [];
    public List<ProductImageDto>? Images { get; set; }
}
