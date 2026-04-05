namespace PowerStore.Application.DTOs.Category;

public class CategoryCreateDto
{
    public required string Name { get; set; }
    public required string Image { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}
