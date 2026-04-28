using PowerStore.Domain.Enums;

namespace PowerStore.Application.DTOs.Order;

public class OrderCreateDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }

    public string? City { get; set; }
    public string? Street { get; set; }
    public string? House { get; set; }
    public string? Apartment { get; set; }

    public string? WarehouseNumber { get; set; }

    public decimal TotalPrice { get; set; }
    public DeliveryType DeliveryMethod { get; set; }
    public PaymentType PaymentType { get; set; }
    public string? CustomerNote { get; set; }

    public List<OrderItemCreateDto> Items { get; set; } = [];
}