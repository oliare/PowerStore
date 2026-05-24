using System.ComponentModel.DataAnnotations;

namespace PowerStore.Domain.Entities;
public class NewsletterSubscription : AuditableEntityBase
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
}