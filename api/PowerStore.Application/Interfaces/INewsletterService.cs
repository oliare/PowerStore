using PowerStore.Application.DTOs;

namespace PowerStore.Application.Interfaces;
public interface INewsletterService
{
    Task<(bool IsSuccess, string Message)> SubscribeAsync(SubscribeNewsletterDto dto);
}