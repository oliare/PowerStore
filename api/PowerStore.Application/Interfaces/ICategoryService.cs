using PowerStore.Application.DTOs.Category;

namespace PowerStore.Application.Interfaces;

public interface ICategoryService
{   
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto?> GetByIdAsync(Guid id);
    Task<CategoryDto> CreateAsync(CategoryCreateDto dto);
}