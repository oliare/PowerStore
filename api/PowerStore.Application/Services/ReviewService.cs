using Microsoft.EntityFrameworkCore;
using PowerStore.Application.DTOs.ProductReview;
using PowerStore.Application.DTOs.Review;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IRepository<ProductReviewEntity> _reviewRepository;
    private readonly IRepository<ProductEntity> _productRepository;

    public ReviewService(IRepository<ProductReviewEntity> reviewRepository, IRepository<ProductEntity> productRepository)
    {
        _reviewRepository = reviewRepository;
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<ReviewDto>> GetProductReviewsAsync(Guid productId)
    {
        return await _reviewRepository.Query()
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.User.UserName,
                UserEmail = r.User.Email,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<bool> AddReviewAsync(Guid userId, CreateReviewDto dto)
    {
        var existing = await _reviewRepository.FirstOrDefaultAsync(r =>
            r.ProductId == dto.ProductId && r.UserId == userId);
        if (existing != null) return false;

        var review = new ProductReviewEntity
        {
            Id = Guid.NewGuid(),
            ProductId = dto.ProductId,
            UserId = userId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        await _reviewRepository.AddAsync(review);
        await _reviewRepository.SaveAsync();

        var allRatings = await _reviewRepository.Query()
            .Where(r => r.ProductId == dto.ProductId)
            .Select(r => r.Rating)
            .ToListAsync();

        double average = allRatings.Any() ? allRatings.Average() : 0;

        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product != null)
        {
            product.Rate = (float)average;
            _productRepository.Update(product);
            await _productRepository.SaveAsync();
        }

        return true;
    }

    public async Task<double> GetAverageRatingAsync(Guid productId)
    {
        var ratings = await _reviewRepository.Query()
            .Where(r => r.ProductId == productId)
            .Select(r => r.Rating)
            .ToListAsync();

        return ratings.Any() ? ratings.Average() : 0;
    }
}