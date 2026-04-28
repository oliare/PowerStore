using PowerStore.Domain.Enums;

namespace PowerStore.Application.DTOs.Order;

public class OrderDto
{
    public Guid Id { get; set; }

    public string City { get; set; } = string.Empty;
    public string? DeliveryAddress { get; set; }

    public decimal TotalPrice { get; set; }

    public DeliveryType DeliveryMethod { get; set; }
    public PaymentType PaymentType { get; set; }
    public OrderStatus Status { get; set; }

    public string? TrackingNumber { get; set; }
    public string? CustomerNote { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<OrderItemDto> Items { get; set; } = [];
}