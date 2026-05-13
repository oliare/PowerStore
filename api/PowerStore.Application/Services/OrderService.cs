using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PowerStore.Application.DTOs.Order;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;
using PowerStore.Domain.Enums;

namespace PowerStore.Application.Services;

public class OrderService : IOrderService
{
    private readonly IRepository<OrderEntity> _orderRepo;
    private readonly IMapper _mapper;
    private readonly IRepository<ProductEntity> _productRepo;

    public OrderService(
        IRepository<OrderEntity> orderRepo,
        IMapper mapper,
        IRepository<ProductEntity> productRepo)
    {
        _orderRepo = orderRepo;
        _mapper = mapper;
        _productRepo = productRepo;
    }

    public async Task<OrderDto> CreateOrderAsync(OrderCreateDto dto, Guid? userId)
    {
        string deliveryAddress = dto.DeliveryMethod switch
        {
            DeliveryType.Courier =>
                $"{dto.City}, вул. {dto.Street}, буд. {dto.House}" +
                (string.IsNullOrWhiteSpace(dto.Apartment) ? "" : $", кв. {dto.Apartment}"),
            DeliveryType.NovaPoshta =>
                $"Нова Пошта, {dto.City}, відділення №{dto.WarehouseNumber}",
            DeliveryType.UkrPoshta =>
                $"Укрпошта, {dto.City}, відділення №{dto.WarehouseNumber}",
            _ => dto.City
        };

        var order = new OrderEntity
        {
            City = dto.City,
            Street = dto.Street,
            House = dto.House,
            Apartment = dto.Apartment,
            DeliveryMethod = dto.DeliveryMethod,
            PaymentType = dto.PaymentType,
            TrackingNumber = GenerateShortTrackingNumber(),
            Status = OrderStatus.Pending,
            DeliveryAddress = deliveryAddress,
            CustomerNote = dto.CustomerNote,
            UserId = userId ?? Guid.Empty,
            Items = new List<OrderItemEntity>()
        };

        decimal calculatedTotal = 0;

        foreach (var itemDto in dto.Items)
        {
            var product = await _productRepo.GetByIdAsync(itemDto.ProductId)
                ?? throw new Exception($"Товар з ID {itemDto.ProductId} не знайдено.");

            if (product.StockQuantity < itemDto.Quantity)
                throw new Exception(
                    $"Недостатньо товару '{product.Name}' на складі. Залишилось: {product.StockQuantity}");

            // Єдине джерело правди — поле DiscountPrice з БД
            decimal actualPrice = (product.IsOnSale && product.DiscountPrice > 0)
                ? product.DiscountPrice
                : product.Price;

            calculatedTotal += actualPrice * itemDto.Quantity;

            product.StockQuantity -= itemDto.Quantity;
            _productRepo.Update(product);

            order.Items.Add(new OrderItemEntity
            {
                ProductId = itemDto.ProductId,
                Quantity = itemDto.Quantity,
                Price = actualPrice
            });
        }

        order.TotalPrice = calculatedTotal;

        await _orderRepo.AddAsync(order);
        await _orderRepo.SaveAsync();

        var saved = await _orderRepo
            .Query()
            .Where(o => o.Id == order.Id)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync();

        return _mapper.Map<OrderDto>(saved);
    }

    public async Task<List<OrderDto>> GetMyOrdersAsync(Guid userId)
    {
        var orders = await _orderRepo
            .Query()
            .Where(o => o.UserId == userId)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return _mapper.Map<List<OrderDto>>(orders);
    }

    public async Task<OrderDto?> GetOrderByIdAsync(Guid id, Guid? userId)
    {
        var query = _orderRepo
            .Query()
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .Where(o => o.Id == id);

        if (userId.HasValue && userId != Guid.Empty)
            query = query.Where(o => o.UserId == userId);

        var order = await query.FirstOrDefaultAsync();
        return order is null ? null : _mapper.Map<OrderDto>(order);
    }

    public async Task UpdateOrderStatusAsync(Guid id, OrderStatus status)
    {
        var order = await _orderRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Order {id} not found");

        order.Status = status;
        _orderRepo.Update(order);
        await _orderRepo.SaveAsync();
    }

    private static string GenerateShortTrackingNumber()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 6)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}