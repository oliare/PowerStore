using Microsoft.EntityFrameworkCore;
using PowerStore.Application.DTOs;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;

namespace PowerStore.Api.Services
{
    public class NewsletterService : INewsletterService
    {
        private readonly IRepository<NewsletterSubscription> _repo;

        public NewsletterService(IRepository<NewsletterSubscription> repo)
        {
            _repo = repo;
        }

        public async Task<(bool IsSuccess, string Message)> SubscribeAsync(SubscribeNewsletterDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email))
            {
                return (false, "Помилка: Дані запиту порожні або не збігаються назви полів.");
            }

            var normalizedEmail = dto.Email.Trim().ToLower();

            var query = _repo.Query();
            if (query == null)
            {
                return (false, "Помилка сервера: Репозиторій не ініціалізував таблицю підписок.");
            }

            var alreadySubscribed = await query.AnyAsync(s => s.Email == normalizedEmail);

            if (alreadySubscribed)
            {
                return (false, "Цей емейл вже підписаний на розсилку!");
            }

            var subscription = new NewsletterSubscription
            {
                Email = normalizedEmail,
                SubscribedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(subscription);
            await _repo.SaveAsync();

            return (true, "Підписка успішно оформлена.");
        }
    }
}