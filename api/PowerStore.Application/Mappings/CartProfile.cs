using AutoMapper;
using PowerStore.Application.DTOs.Cart;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Mappings;

public class CartProfile : Profile
{
    public CartProfile()
    {
        CreateMap<CartEntity, CartItemDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price))
            .ForMember(dest => dest.ProductImage, opt => opt.MapFrom(src =>
        src.Product.Images
            .OrderBy(i => i.DisplayOrder)
            .Select(i => i.Image)
            .FirstOrDefault()));

        CreateMap<CartItemDto, CartEntity>();
    }
}
