using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using PowerStore.Application.DTOs.Cart;
using PowerStore.Application.Interfaces;
using PowerStore.Domain.Entities;

namespace PowerStore.Application.Services
{
    public class CartService : ICartService
    {
        private readonly IRepository<CartEntity> _repo;
        private readonly IMapper _mapper;

        public CartService(IRepository<CartEntity> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<List<CartItemDto>> GetCartByUserIdAsync(Guid userId)
        {
            return await _repo.Query()
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)                        
                    .ThenInclude(p => p.Images)
                .ProjectTo<CartItemDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task SyncCartAsync(Guid userId, SyncCartDto syncDto)
        {
            var existingItems = await _repo.Query()
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (syncDto.Items == null || !syncDto.Items.Any()) return;
            foreach (var newItem in syncDto.Items)
            {
                var existing = existingItems.FirstOrDefault(x => x.ProductId == newItem.ProductId);

                if (existing != null)
                {
                    existing.Quantity = newItem.Quantity;
                    _repo.Update(existing);
                }
                else
                {
                    var cartItem = _mapper.Map<CartEntity>(newItem);
                    cartItem.UserId = userId;
                    await _repo.AddAsync(cartItem);
                }
            }

            await _repo.SaveAsync();
        }

        public async Task ClearCartAsync(Guid userId)
        {
            var items = await _repo.Query()
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (items.Any())
            {
                _repo.DeleteRange(items);
                await _repo.SaveAsync();
            }
        }
    }
}