using AutoMapper;
using PowerStore.Application.DTOs.Product;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Mappings;

public class ProductProfile : Profile
{
    public ProductProfile()
    {
        CreateMap<ProductEntity, ProductDto>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src =>
                src.Tags == null
                    ? new List<string>()
                    : src.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            ));
        CreateMap<ProductDto, ProductEntity>();
        CreateMap<ProductCreateDto, ProductEntity>();
    }
}