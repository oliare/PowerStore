using AutoMapper;
using PowerStore.Application.DTOs.Favorite;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Mappings;

public class FavoriteProfile : Profile
{
    public FavoriteProfile()
    {
        CreateMap<FavoriteEntity, FavoriteResponseDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.AddedAt, opt => opt.MapFrom(src => src.AddedAt))
            .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product));
    }
}