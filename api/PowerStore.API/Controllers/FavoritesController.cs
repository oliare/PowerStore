using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PowerStore.API.Extensions;
using PowerStore.Application.DTOs.Favorite;
using PowerStore.Application.Interfaces;
using System.Security.Claims;

namespace PowerStore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FavoriteResponseDto>>> GetMyFavorites()
    {
        var userId = User.GetUserId();
        var result = await _favoriteService.GetUserFavoritesAsync(userId);
        return Ok(result);
    }

    [HttpPost("toggle")]
    public async Task<IActionResult> ToggleFavorite([FromBody] ToggleFavoriteRequestDto request)
    {
        var userId = User.GetUserId();
        var isAdded = await _favoriteService.ToggleFavoriteAsync(userId, request.ProductId);

        return Ok(new
        {
            Added = isAdded,
            Message = isAdded ? "Додано до обраного" : "Видалено з обраного"
        });
    }

    [HttpPost("sync")]
    public async Task<ActionResult<IEnumerable<FavoriteResponseDto>>> SyncFavorites([FromBody] List<Guid> productIds)
    {
        var userId = User.GetUserId();
        // Викликаємо сервіс, який додасть нові ID до тих, що вже є в базі
        var result = await _favoriteService.SyncFavoritesAsync(userId, productIds);
        return Ok(result);
    }
}