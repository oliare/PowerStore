using PowerStore.Application.DTOs.Order;
using PowerStore.Domain.Enums;

namespace PowerStore.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(OrderCreateDto dto, Guid? userId);
    Task<List<OrderDto>> GetMyOrdersAsync(Guid userId);
    Task<OrderDto?> GetOrderByIdAsync(Guid id, Guid? userId);
    Task UpdateOrderStatusAsync(Guid id, OrderStatus status);
}