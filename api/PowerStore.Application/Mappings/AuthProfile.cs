using AutoMapper;
using PowerStore.Application.DTOs.Auth;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Mappings;

public class AuthProfile : Profile
{
    public AuthProfile()
    {
        CreateMap<RegisterRequestDto, UserEntity>()
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Phone));
    }
}
