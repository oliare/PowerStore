using AutoMapper;
using PowerStore.Application.DTOs.Product;
using PowerStore.Domain.Entities;

public class ProductProfile : Profile
{
    public ProductProfile()
    {
        CreateMap<ProductEntity, ProductDto>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src =>
                src.Tags == null
                    ? new List<string>()
                    : src.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()))

            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))

            .ForMember(dest => dest.IsOnSale, opt => opt.MapFrom(src => src.IsOnSale))

            .ForMember(dest => dest.DiscountPercentage, opt => opt.MapFrom(src =>
                src.IsOnSale ? src.DiscountPercentage : null))

            .ForMember(dest => dest.DiscountPrice, opt => opt.MapFrom(src =>
                src.IsOnSale
                    ? src.DiscountPrice > 0
                        ? (decimal?)src.DiscountPrice
                        : src.DiscountPercentage.HasValue && src.DiscountPercentage.Value > 0
                            ? (decimal?)Math.Round(src.Price * (1 - src.DiscountPercentage.Value / 100m), 2)
                            : null
                    : null))

            .ForMember(dest => dest.Image, opt => opt.MapFrom(src =>
                src.Images != null && src.Images.Any()
                    ? src.Images.First().Image
                    : null));

        CreateMap<ProductDto, ProductEntity>();
        CreateMap<ProductCreateDto, ProductEntity>();
    }
}