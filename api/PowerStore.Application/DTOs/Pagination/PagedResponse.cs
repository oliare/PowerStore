namespace PowerStore.Application.DTOs.Pagination;

public class PagedResponse<T>
{
    public IEnumerable<T> Items { get; set; } = [];
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
    public int TotalItems { get; set; }
}