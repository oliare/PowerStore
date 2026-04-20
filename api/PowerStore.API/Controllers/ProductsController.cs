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
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(int? limit)
    {
        var products = await _productService.GetAllAsync(limit);
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
}