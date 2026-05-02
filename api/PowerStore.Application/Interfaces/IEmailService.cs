using PowerStore.Application.DTOs.Cart;
using PowerStore.Application.DTOs.Email;

namespace PowerStore.Application.Interfaces;

public interface IEmailService
{
    Task SendOrderConfirmationAsync(
        string userEmail,
        string userName,
        decimal totalPrice,
        List<CartItemDto> items,
        string? customerNote = null);

    Task SaveContactMessageAsync(ContactMessageDto messageDto);
}
