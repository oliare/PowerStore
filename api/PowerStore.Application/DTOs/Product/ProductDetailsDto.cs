namespace PowerStore.Application.DTOs.Product;

public class ProductDetailsDto
{
    public ProductDto Product { get; set; }
    public List<ProductDto> RelatedProducts { get; set; } = new();
}