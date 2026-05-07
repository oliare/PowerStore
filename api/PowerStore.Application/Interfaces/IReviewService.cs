using PowerStore.Application.DTOs.ProductReview;
using PowerStore.Application.DTOs.Review;

namespace PowerStore.Application.Interfaces;

public interface IReviewService
{
    Task<IEnumerable<ReviewDto>> GetProductReviewsAsync(Guid productId);
    Task<bool> AddReviewAsync(Guid userId, CreateReviewDto dto);
    Task<double> GetAverageRatingAsync(Guid productId);
}