using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using PowerStore.Application.DTOs.Category;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IRepository<CategoryEntity> _repo;
    private readonly IMapper _mapper;

    public CategoryService(IRepository<CategoryEntity> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        return await _repo.Query()
            .ProjectTo<CategoryDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<CategoryDto?> GetByIdAsync(Guid id)
    {
        return await _repo.Query()
            .Where(c => c.Id == id)
            .ProjectTo<CategoryDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    public async Task<CategoryDto> CreateAsync(CategoryCreateDto dto)
    {
        var entity = _mapper.Map<CategoryEntity>(dto);

        await _repo.AddAsync(entity);
        await _repo.SaveAsync();

        return _mapper.Map<CategoryDto>(entity);
    }
}