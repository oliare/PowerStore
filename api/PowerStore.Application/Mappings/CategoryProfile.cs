using AutoMapper;
using PowerStore.Application.DTOs.Category;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Mappings;

public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        CreateMap<CategoryEntity, CategoryDto>().ReverseMap();
        CreateMap<CategoryCreateDto, CategoryEntity>();
    }
}

