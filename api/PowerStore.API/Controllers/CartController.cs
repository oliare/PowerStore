using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PowerStore.API.Extensions;
using PowerStore.Application.DTOs.Cart;
using PowerStore.Application.Interfaces;

namespace PowerStore.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.GetUserId();
            var cart = await _cartService.GetCartByUserIdAsync(userId);
            return Ok(cart);
        }

        [HttpPost("sync")]
        public async Task<IActionResult> SyncCart([FromBody] SyncCartDto dto)
        {
            var userId = User.GetUserId();
            await _cartService.SyncCartAsync(userId, dto);
            var updatedCart = await _cartService.GetCartByUserIdAsync(userId); return Ok(updatedCart);
        }
    }
}
