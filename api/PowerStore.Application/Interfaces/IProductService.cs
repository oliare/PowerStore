using PowerStore.Application.DTOs.Pagination;
using PowerStore.Application.DTOs.Product;

namespace PowerStore.Application.Interfaces;

public interface IProductService
{
    Task<PagedResponse<ProductDto>> GetAllAsync(int page = 1, int pageSize = 12, Guid? categoryId = null);
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<ProductDto> CreateAsync(ProductCreateDto dto);
    Task<ProductDetailsDto> GetProductDetailsAsync(Guid id);
}