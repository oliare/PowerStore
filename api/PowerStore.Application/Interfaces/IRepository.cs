using System.Linq.Expressions;

namespace PowerStore.Application.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<TEntity?> GetByIdAsync(Guid id);
        Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate);

        Task AddAsync(TEntity entity);
        Task AddRangeAsync(IEnumerable<TEntity> entities);

        void Update(TEntity entity);
        void Delete(TEntity entity);
        void DeleteRange(IEnumerable<TEntity> entities);

        IQueryable<TEntity> Query();

        Task SaveAsync();
    }
}
