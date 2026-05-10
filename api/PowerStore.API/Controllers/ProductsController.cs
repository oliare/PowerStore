using Microsoft.AspNetCore.Mvc;
using PowerStore.Application.DTOs.Product;
using PowerStore.Application.Interfaces;

namespace PowerStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        [FromQuery] Guid? categoryId = null)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 12;

        var products = await _productService.GetAllAsync(page, pageSize, categoryId);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpGet("details/{id}")]
    public async Task<ActionResult<ProductDetailsDto>> GetProductDetails(Guid id)
    {
        var details = await _productService.GetProductDetailsAsync(id);
        return Ok(details);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(ProductCreateDto dto)
    {
        var entity = await _productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetProduct), new { id = entity.Id }, entity);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> Search([FromQuery] string query, [FromQuery] int count)
    {
        var results = await _productService.SearchProductsAsync(query, count);

        return Ok(results);
    }

    [HttpPost("check-stock")]
    public async Task<ActionResult<IEnumerable<ProductStockDto>>> CheckStock([FromBody] List<Guid> ids)
    {
        var result = await _productService.CheckStockAsync(ids);
        return Ok(result);
    }
}