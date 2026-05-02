using Microsoft.AspNetCore.Mvc;
using PowerStore.Application.DTOs.Category;
using PowerStore.Application.Interfaces;
using PowerStore.Application.Services;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _service;

    public CategoriesController(ICategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        var categories = await _service.GetAllAsync();
        return Ok(categories);
    }

    [HttpGet("tree")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetTree()
    {
        var tree = await _service.GetCategoryTreeAsync();
        return Ok(tree);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetById(Guid id)
    {
        var category = await _service.GetByIdAsync(id);
        if (category == null) return NotFound();

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(CategoryCreateDto dto)
    {
        var entity = await _service.CreateAsync(dto);

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpGet("top")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetTopCategoriesAsync(int count)
    {
        return Ok(await _service.GetTopCategoriesAsync(count));
    }
}