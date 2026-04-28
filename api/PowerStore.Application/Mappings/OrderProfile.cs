using AutoMapper;
using PowerStore.Application.DTOs.Order;
using PowerStore.Domain.Entities;

public class OrderMappingProfile : Profile
{
    public OrderMappingProfile()
    {
        CreateMap<OrderCreateDto, OrderEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.TrackingNumber, opt => opt.Ignore())
            .ForMember(dest => dest.DeliveryAddress, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeliveryMethod, opt => opt.MapFrom(src => src.DeliveryMethod))
            .ForMember(dest => dest.Items, opt => opt.Ignore());

        CreateMap<OrderItemCreateDto, OrderItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.OrderId, opt => opt.Ignore())
            .ForMember(dest => dest.Order, opt => opt.Ignore())
            .ForMember(dest => dest.Product, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

        CreateMap<OrderEntity, OrderDto>()
            .ForMember(dest => dest.DeliveryMethod,
                opt => opt.MapFrom(src => src.DeliveryMethod))
            .ForMember(dest => dest.Items,
                opt => opt.MapFrom(src => src.Items));

        CreateMap<OrderItemEntity, OrderItemDto>()
            .ForMember(dest => dest.Id,
                opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.ProductName,
                opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : "Невідомий товар"))
            .ForMember(dest => dest.Image,
                opt => opt.MapFrom(src => src.Product != null ? src.Product.Image : null));
    }
}