using AutoMapper;
using PowerStore.Application.DTOs.Cart;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Mappings;

public class CartProfile : Profile
{
    public CartProfile()
    {
        CreateMap<CartEntity, CartItemDto>()
            .ForMember(dest => dest.ProductName,
                opt => opt.MapFrom(src => src.Product.Name))

            .ForMember(dest => dest.Price, opt => opt.MapFrom(src =>
                src.Product.IsOnSale && src.Product.DiscountPrice > 0
                    ? src.Product.DiscountPrice
                    : src.Product.Price))

            .ForMember(dest => dest.StockQuantity,
                opt => opt.MapFrom(src => src.Product.StockQuantity))

            .ForMember(dest => dest.IsOnSale,
                opt => opt.MapFrom(src => src.Product.IsOnSale))

            .ForMember(dest => dest.DiscountPercentage,
                opt => opt.MapFrom(src =>
                    src.Product.IsOnSale ? src.Product.DiscountPercentage : null))

            .ForMember(dest => dest.DiscountPrice, opt => opt.MapFrom(src =>
                src.Product.IsOnSale && src.Product.DiscountPrice > 0
                    ? (decimal?)src.Product.DiscountPrice
                    : null))

            .ForMember(dest => dest.ProductImage, opt => opt.MapFrom(src =>
                src.Product.Images
                    .OrderBy(i => i.DisplayOrder)
                    .Select(i => i.Image)
                    .FirstOrDefault()));

        CreateMap<CartItemDto, CartEntity>();
    }
}