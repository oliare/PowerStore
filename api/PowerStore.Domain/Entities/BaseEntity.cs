namespace PowerStore.Domain.Entities;

public abstract class EntityBase
{
    public Guid Id { get; set; }
}

public abstract class CreatedEntityBase : EntityBase
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public abstract class AuditableEntityBase : CreatedEntityBase
{
    public DateTime? UpdatedAt { get; set; }
}
