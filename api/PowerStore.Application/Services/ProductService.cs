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

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        return await _repo.Query()
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

    public async Task<ProductDto> CreateAsync(ProductCreateDto dto)
    {
        var entity = _mapper.Map<ProductEntity>(dto);

        await _repo.AddAsync(entity);
        await _repo.SaveAsync();

        return _mapper.Map<ProductDto>(entity);
    }
}