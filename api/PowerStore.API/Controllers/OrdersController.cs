using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PowerStore.Application.DTOs.Cart;
using PowerStore.Application.DTOs.Order;
using PowerStore.Application.Interfaces;
using System.Security.Claims;

namespace PowerStore.API.Controllers;

[Authorize]
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IEmailService _emailService;
    public OrdersController(IOrderService orderService, IEmailService emailService)
    {
        _orderService = orderService;
        _emailService = emailService;
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(claim, out var id) ? id : null;
    }

    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = GetCurrentUserId()!.Value;
        var orders = await _orderService.GetMyOrdersAsync(userId);
        return Ok(orders);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var userId = GetCurrentUserId();
        var order = await _orderService.GetOrderByIdAsync(id, userId);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
    {
        var userId = GetCurrentUserId();
        var order = await _orderService.CreateOrderAsync(dto, userId);

        try
        {
            var emailItems = order.Items.Select(i => new CartItemDto
            {
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                Price = i.Price
            }).ToList();

            await _emailService.SendOrderConfirmationAsync(
                dto.Email ?? "no-reply@email.com",
                $"{dto.FirstName} {dto.LastName}",
                order.TotalPrice,
                emailItems
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Помилка відправки пошти: {ex.Message}");
        }

        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
    }
}
