using PowerStore.Application.DTOs.Favorite;

namespace PowerStore.Application.Interfaces;

public interface IFavoriteService
{
    Task<IEnumerable<FavoriteResponseDto>> GetUserFavoritesAsync(Guid userId);
    Task<bool> ToggleFavoriteAsync(Guid userId, Guid productId);
    Task<IEnumerable<FavoriteResponseDto>> SyncFavoritesAsync(Guid userId, List<Guid> productIds);
    Task<int> GetFavoritesCountAsync(Guid userId);
}