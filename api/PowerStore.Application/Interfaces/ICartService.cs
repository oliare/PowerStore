using PowerStore.Application.DTOs.Cart;

namespace PowerStore.Application.Interfaces;

public interface ICartService
{
    Task<List<CartItemDto>> GetCartByUserIdAsync(Guid userId);
    Task SyncCartAsync(Guid userId, SyncCartDto syncDto);
    Task ClearCartAsync(Guid userId);
}
