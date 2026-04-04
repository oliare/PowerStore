using AutoMapper;
using PowerStore.Application.DTOs.Product;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Mappings;

public class ProductProfile : Profile
{
    public ProductProfile()
    {
        CreateMap<ProductEntity, ProductDto>();
        CreateMap<ProductDto, ProductEntity>();
        CreateMap<ProductCreateDto, ProductEntity>();
    }
}