using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using PowerStore.Application.DTOs.Product;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Services;
public class ProductService : IProductService
{
    private readonly IRepository<ProductEntity> _repo;
    private readonly IMapper _mapper;

    public ProductService(IRepository<ProductEntity> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync(int? limit = null)
    {
        var query = _repo.Query();
        if (limit.HasValue)  query = query.Take(limit.Value);

        return await query
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        return await _repo.Query()
            .Where(p => p.Id == id)
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    public async Task<ProductDetailsDto> GetProductDetailsAsync(Guid id)
    {
        var product = await _repo.Query()
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException("Товар не знайдено");

        var relatedProducts = await _repo.Query()
            .Where(p => p.CategoryId == product.CategoryId && p.Id != id)
            .OrderByDescending(p => p.CreatedAt)
            .Take(4)
            .Include(p => p.Images)
            .ToListAsync();

        return new ProductDetailsDto
        {
            Product = _mapper.Map<ProductDto>(product),
            RelatedProducts = _mapper.Map<List<ProductDto>>(relatedProducts)
        };
    }

    public async Task<ProductDto> CreateAsync(ProductCreateDto dto)
    {
        var entity = _mapper.Map<ProductEntity>(dto);

        await _repo.AddAsync(entity);
        await _repo.SaveAsync();

        return _mapper.Map<ProductDto>(entity);
    }
}