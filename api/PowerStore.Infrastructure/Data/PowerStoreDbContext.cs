using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PowerStore.Domain.Entities;

namespace PowerStore.Infrastructure.Data;

public class PowerStoreDbContext : IdentityDbContext<UserEntity, RoleEntity, Guid>
{
    public PowerStoreDbContext(DbContextOptions<PowerStoreDbContext> options)
        : base(options)
    {
    }

    public DbSet<ProductEntity> Products { get; set; }
    public DbSet<ProductImageEntity> ProductImages { get; set; }
    public DbSet<CategoryEntity> Categories { get; set; }
    public DbSet<FavoriteEntity> Favorites { get; set; }
    public DbSet<CartEntity> Carts { get; set; }
    public DbSet<OrderEntity> Orders { get; set; }
    public DbSet<OrderItemEntity> OrderItems { get; set; }
    public DbSet<ContactMessageEntity> ContactMessages { get; set; }
    public DbSet<ProductReviewEntity> ProductReviews { get; set; }
    public DbSet<RefreshTokenEntity> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<FavoriteEntity>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId);

        builder.Entity<FavoriteEntity>()
            .HasOne(f => f.Product)
            .WithMany()
            .HasForeignKey(f => f.ProductId);

        builder.Entity<CartEntity>()
            .HasOne(c => c.Product)
            .WithMany()
            .HasForeignKey(c => c.ProductId);

        builder.Entity<OrderEntity>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId);

        builder.Entity<OrderItemEntity>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId);

        builder.Entity<OrderItemEntity>()
            .HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId);

        builder.Entity<CategoryEntity>(entity =>
        {
            entity.HasOne(c => c.Parent)
                .WithMany(c => c.Childrens)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<ProductReviewEntity>(entity =>
        {
            entity.HasOne(r => r.Product)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(r => new { r.UserId, r.ProductId })
                .IsUnique();
        });

        builder.Entity<RefreshTokenEntity>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.HasIndex(t => t.TokenHash).IsUnique();
            entity.HasIndex(t => t.UserId);
            entity.HasIndex(t => t.TokenFamilyId);

            entity.Property(t => t.TokenHash).HasMaxLength(128).IsRequired();

            entity.HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
