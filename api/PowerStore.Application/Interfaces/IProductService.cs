using PowerStore.Application.DTOs.Product;

namespace PowerStore.Application.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync(int? limit);
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<ProductDto> CreateAsync(ProductCreateDto dto);
    Task<ProductDetailsDto> GetProductDetailsAsync(Guid id);
}