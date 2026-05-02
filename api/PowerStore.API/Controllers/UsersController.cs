using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PowerStore.Application.Interfaces;
using PowerStore.API.Extensions;
using PowerStore.Application.DTOs.Email;

namespace PowerStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IEmailService _emailService;

    public UsersController(IUserService userService, IEmailService emailService)
    {
        _userService = userService;
        _emailService = emailService;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.GetUserId();
        var user = await _userService.GetMeAsync(userId);

        return user == null ? NotFound() : Ok(user);
    }

    [HttpPost("contact-message")]
    public async Task<IActionResult> SendContactMessage([FromBody] ContactMessageDto messageDto)
    {
        Console.WriteLine($"Recieved: {messageDto.Email}");

        await _emailService.SaveContactMessageAsync(messageDto);
        return Ok();
    }
}
