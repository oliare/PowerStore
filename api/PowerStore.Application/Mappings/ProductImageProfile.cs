
using AutoMapper;
using PowerStore.Application.DTOs.ProductImage;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Mappings;

public class ProductImageProfile : Profile
{
    public ProductImageProfile()
    {
        CreateMap<ProductImageDto, ProductImageEntity>();
        CreateMap<ProductImageEntity, ProductImageDto>();
    }
}
