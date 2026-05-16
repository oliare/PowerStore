using PowerStore.Application.DTOs.Pagination;
using PowerStore.Application.DTOs.Product;

namespace PowerStore.Application.Interfaces;

public interface IProductService
{
    Task<PagedResponse<ProductDto>> GetAllAsync(int page = 1, int pageSize = 12, Guid? categoryId = null, List<string>? brands = null);
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<ProductDto> CreateAsync(ProductCreateDto dto);
    Task<ProductDetailsDto> GetProductDetailsAsync(Guid id);
    Task<IEnumerable<ProductDto>> SearchProductsAsync(string query, int count);
    Task<IEnumerable<ProductStockDto>> CheckStockAsync(List<Guid> productIds);
    Task<IEnumerable<string>> GetAllBrandsAsync();
}