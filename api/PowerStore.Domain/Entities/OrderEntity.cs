using PowerStore.Domain.Enums;

namespace PowerStore.Domain.Entities;

public class OrderEntity : AuditableEntityBase
{
    public Guid UserId { get; set; }
    public UserEntity User { get; set; }

    public required string City { get; set; }
    public string? Street { get; set; }
    public string? House { get; set; }
    public string? Apartment { get; set; }
    public decimal TotalPrice { get; set; }

    public required DeliveryType DeliveryMethod { get; set; }
    public required PaymentType PaymentType { get; set; }
    public required OrderStatus Status { get; set; } = OrderStatus.Pending;
    public string? DeliveryAddress { get; set; }
    public string? CustomerNote { get; set; }
    public string? TrackingNumber { get; set; }

    public virtual ICollection<OrderItemEntity> Items { get; set; } = [];
}
