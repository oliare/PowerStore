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

    public OrderService(IRepository<OrderEntity> orderRepo, IMapper mapper)
    {
        _orderRepo = orderRepo;
        _mapper = mapper;
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
            TotalPrice = dto.TotalPrice,
            DeliveryMethod = dto.DeliveryMethod,
            PaymentType = dto.PaymentType,
            Status = OrderStatus.Pending,
            DeliveryAddress = deliveryAddress,
            CustomerNote = dto.CustomerNote,
            UserId = userId ?? Guid.Empty,
        };

        foreach (var itemDto in dto.Items)
        {
            order.Items.Add(new OrderItemEntity
            {
                ProductId = itemDto.ProductId,
                Quantity = itemDto.Quantity,
                Price = itemDto.Price,
            });
        }

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
}