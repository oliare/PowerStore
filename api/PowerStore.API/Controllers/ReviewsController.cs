using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PowerStore.Application.DTOs.ProductReview;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;
    private readonly UserManager<UserEntity> _userManager;

    public ReviewsController(IReviewService reviewService, UserManager<UserEntity> userManager)
    {
        _reviewService = reviewService;
        _userManager = userManager;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddReview([FromBody] CreateReviewDto dto)
    {
        var userId = Guid.Parse(_userManager.GetUserId(User)!);

        var result = await _reviewService.AddReviewAsync(userId, dto);

        if (!result)
            return BadRequest("You have already left feedback or the data is incorrect");

        return Ok(new { message = "Review added successfully" });
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetReviews(Guid productId)
    {
        var reviews = await _reviewService.GetProductReviewsAsync(productId);
        return Ok(reviews);
    }
}