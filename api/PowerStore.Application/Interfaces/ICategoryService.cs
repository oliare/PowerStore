using PowerStore.Application.DTOs.Category;

namespace PowerStore.Application.Interfaces;

public interface ICategoryService
{   
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<IEnumerable<CategoryDto>> GetTopCategoriesAsync(int count);
    Task<IEnumerable<CategoryDto>> GetCategoryTreeAsync();
    Task<CategoryDto?> GetByIdAsync(Guid id);
    Task<CategoryDto> CreateAsync(CategoryCreateDto dto);
}