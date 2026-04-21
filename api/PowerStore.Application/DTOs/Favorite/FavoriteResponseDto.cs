namespace PowerStore.Application.DTOs.Favorite;

public record FavoriteResponseDto
{
    public Guid Id { get; init; }
    public Guid ProductId { get; init; }
    public string? ProductName { get; init; }
    public decimal ProductPrice { get; init; }
    public string? ProductImage { get; init; }
    public DateTime AddedAt { get; init; }
}

public record ToggleFavoriteRequestDto(Guid ProductId);