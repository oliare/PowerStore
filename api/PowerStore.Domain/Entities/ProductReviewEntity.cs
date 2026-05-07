namespace PowerStore.Domain.Entities;

public class ProductReviewEntity : AuditableEntityBase
{
    public Guid ProductId { get; set; }
    public ProductEntity Product { get; set; }
    public Guid UserId { get; set; }
    public UserEntity User { get; set; }

    public int Rating { get; set; }
    public string? Comment { get; set; }
}