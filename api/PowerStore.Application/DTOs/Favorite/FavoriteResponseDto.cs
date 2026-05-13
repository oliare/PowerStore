using PowerStore.Application.DTOs.Product;

namespace PowerStore.Application.DTOs.Favorite;

public record FavoriteResponseDto
{
    public Guid Id { get; init; }
    public DateTime AddedAt { get; init; }
    public ProductDto Product { get; init; }
}

public record ToggleFavoriteRequestDto(Guid ProductId);