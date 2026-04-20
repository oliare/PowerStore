namespace PowerStore.Application.DTOs.Cart;

public class CartItemDto
{
    public Guid ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? ProductImage { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

public class SyncCartDto
{
    public List<CartItemDto>? Items { get; set; }
}