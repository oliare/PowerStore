using PowerStore.Application.DTOs.Cart;

namespace PowerStore.Application.Interfaces;

public interface IEmailService
{
    Task SendOrderConfirmationAsync(
        string userEmail,
        string userName,
        decimal totalPrice,
        List<CartItemDto> items,
        string? customerNote = null);
}
