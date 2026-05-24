using System.ComponentModel.DataAnnotations;

namespace PowerStore.Application.DTOs;

public class SubscribeNewsletterDto
{
    [Required(ErrorMessage = "Електронна адреса є обов'язковою")]
    [EmailAddress(ErrorMessage = "Некоректний формат електронної адреси")]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;
}
