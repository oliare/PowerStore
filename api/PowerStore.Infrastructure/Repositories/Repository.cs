using Microsoft.EntityFrameworkCore;
using PowerStore.Application.Interfaces;
using PowerStore.Infrastructure.Data;
using System.Linq.Expressions;

namespace PowerStore.Infrastructure.Repositories;

public class GenericRepository<TEntity> : IRepository<TEntity> where TEntity : class
{
    private readonly PowerStoreDbContext _context;
    private readonly DbSet<TEntity> _dbSet;

    public GenericRepository(PowerStoreDbContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    public async Task<TEntity?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate)
    {
        return await _dbSet.FirstOrDefaultAsync(predicate);
    }

    public async Task AddAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public async Task AddRangeAsync(IEnumerable<TEntity> entities)
    {
        await _dbSet.AddRangeAsync(entities);
    }

    public void Update(TEntity entity)
    {
        _dbSet.Update(entity);
    }

    public void Delete(TEntity entity)
    {
        _dbSet.Remove(entity);
    }

    public void DeleteRange(IEnumerable<TEntity> entities)
    {
        _dbSet.RemoveRange(entities);
    }

    public IQueryable<TEntity> Query()
    {
        return _dbSet.AsQueryable();
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}