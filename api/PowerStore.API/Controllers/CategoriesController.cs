using Microsoft.AspNetCore.Mvc;
using PowerStore.Application.DTOs.Category;
using PowerStore.Application.Interfaces;

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
}