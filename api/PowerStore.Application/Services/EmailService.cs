using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using PowerStore.Application.DTOs.Cart;
using PowerStore.Application.DTOs.Email;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;
    private readonly IRepository<ContactMessageEntity> _repo;

    public EmailService(IConfiguration config, IRepository<ContactMessageEntity> repo)
    {
        _repo = repo;
        _settings = new EmailSettings();

        config.GetSection("EmailSettings").Bind(_settings);

        if (string.IsNullOrEmpty(_settings.SmtpServer))
        {
            throw new Exception("Не вдалося завантажити налаштування пошти. Перевірте appsettings.json");
        }
    }

    public async Task SaveContactMessageAsync(ContactMessageDto messageDto)
    {
        var entity = new ContactMessageEntity
        {
            Name = messageDto.Name,
            Email = messageDto.Email,
            Subject = messageDto.Subject,
            Message = messageDto.Message,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(entity);
        await _repo.SaveAsync();
    }

    public async Task SendOrderConfirmationAsync(
        string userEmail,
        string userName,
        decimal totalPrice,
        List<CartItemDto> items,
        string? customerNote = null)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
        message.To.Add(new MailboxAddress("", userEmail));
        message.Subject = "Ваше замовлення прийнято! 🌿";

        var builder = new BodyBuilder();

        builder.HtmlBody = GenerateHtmlBody(userName, totalPrice, items, customerNote);
        message.Body = builder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(_settings.SmtpServer, _settings.Port, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_settings.SenderEmail, _settings.Password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    private string GenerateHtmlBody(string userName, decimal totalPrice, List<CartItemDto> items, string? customerNote)
    {
        string baseDir = AppDomain.CurrentDomain.BaseDirectory;
        string pathToFile = Path.Combine(baseDir, "HtmlTemplates", "OrderConfirmation.html");

        if (!File.Exists(pathToFile))
        {
            pathToFile = Path.Combine(Directory.GetCurrentDirectory(), "HtmlTemplates", "OrderConfirmation.html");
        }

        if (!File.Exists(pathToFile))
        {
            pathToFile = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())!.FullName, "PowerStore.Application", "HtmlTemplates", "OrderConfirmation.html");
        }

        if (!File.Exists(pathToFile))
            throw new FileNotFoundException($"Template not found: {pathToFile}");

        string body = File.ReadAllText(pathToFile);

        var itemsHtml = string.Join("", items.Select(i => $@"
        <tr>
            <td style='padding: 10px; border-bottom: 1px solid #eee;'>
                <b style='color: #333;'>{i.ProductName}</b> <span style='color: #888;'>(x{i.Quantity})</span>
            </td>
            <td style='text-align: right; border-bottom: 1px solid #eee; font-weight: bold; color: #1C4D8D;'>
                ₴{i.Price * i.Quantity:F2}
            </td>
        </tr>"));

        string commentHtml = "";
        if (!string.IsNullOrWhiteSpace(customerNote))
        {
            commentHtml = $@"
            <div style='margin-top: 25px; padding: 20px; border-left: 4px solid #4988C4; background-color: #f8fbff; border-radius: 0 12px 12px 0;'>
                <h4 style='margin: 0 0 8px 0; color: #0F2854; font-size: 14px; font-weight: 700; text-transform: uppercase;'>Коментар:</h4>
                <p style='margin: 0; color: #4b5563; font-size: 14px; font-style: italic; line-height: 1.5;'>
                    ""{customerNote}""
                </p>
            </div>";
        }

        return body
            .Replace("{{UserName}}", userName)
            .Replace("{{TotalPrice}}", totalPrice.ToString("F2"))
            .Replace("{{Items}}", itemsHtml)
            .Replace("{{CustomerNoteBlock}}", commentHtml);
    }
}