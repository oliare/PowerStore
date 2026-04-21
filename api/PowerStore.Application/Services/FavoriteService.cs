using Microsoft.EntityFrameworkCore;
using PowerStore.Application.DTOs.Favorite;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IRepository<FavoriteEntity> _favRepo;
    private readonly IRepository<ProductEntity> _productRepo;
    public FavoriteService(IRepository<FavoriteEntity> favoriteRepository, IRepository<ProductEntity> productRepo)
    {
        _favRepo = favoriteRepository;
        _productRepo = productRepo;
    }

    public async Task<IEnumerable<FavoriteResponseDto>> GetUserFavoritesAsync(Guid userId)
    {
        var favorites = await _favRepo.Query()
            .AsNoTracking()
            .Include(f => f.Product)
                .ThenInclude(p => p.Images)
            .Where(f => f.UserId == userId)
            .ToListAsync();

        return favorites.Select(f => new FavoriteResponseDto
        {
            Id = f.Id,
            ProductId = f.ProductId,
            ProductName = f.Product?.Name ?? "Unknown",
            ProductPrice = f.Product?.Price ?? 0,
            ProductImage = f.Product?.Images?.FirstOrDefault()?.Image,
            AddedAt = f.AddedAt
        });
    }

    public async Task<bool> ToggleFavoriteAsync(Guid userId, Guid productId)
    {
        var existing = await _favRepo.FirstOrDefaultAsync(
            f => f.UserId == userId && f.ProductId == productId);

        if (existing != null)
        {
            _favRepo.Delete(existing);
            await _favRepo.SaveAsync();
            return false;
        }

        var favorite = new FavoriteEntity
        {
            UserId = userId,
            ProductId = productId,
            AddedAt = DateTime.UtcNow
        };

        await _favRepo.AddAsync(favorite);
        await _favRepo.SaveAsync();
        return true;
    }

    public async Task<IEnumerable<FavoriteResponseDto>> SyncFavoritesAsync(Guid userId, List<Guid> productIds)
    {
        if (productIds == null || !productIds.Any())
            return await GetUserFavoritesAsync(userId);

        var existingFavIds = await _favRepo.Query()
            .Where(f => f.UserId == userId)
            .Select(f => f.ProductId)
            .ToListAsync();

        var validProductIds = await _productRepo.Query()
            .Where(p => productIds.Contains(p.Id))
            .Select(p => p.Id)
            .ToListAsync();

        bool hasChanges = false;

        foreach (var productId in validProductIds)
        {
            if (!existingFavIds.Contains(productId))
            {
                await _favRepo.AddAsync(new FavoriteEntity
                {
                    UserId = userId,
                    ProductId = productId,
                    AddedAt = DateTime.UtcNow
                });
                hasChanges = true;
            }
        }

        if (hasChanges)
        {
            await _favRepo.SaveAsync();
        }

        return await GetUserFavoritesAsync(userId);
    }

    public async Task<int> GetFavoritesCountAsync(Guid userId)
    {
        return await _favRepo.Query().CountAsync(f => f.UserId == userId);
    }
}