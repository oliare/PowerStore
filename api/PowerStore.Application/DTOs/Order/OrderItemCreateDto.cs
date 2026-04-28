namespace PowerStore.Application.DTOs.Order;

public class OrderItemCreateDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}