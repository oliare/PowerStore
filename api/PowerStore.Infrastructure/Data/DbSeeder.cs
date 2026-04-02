using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PowerStore.Domain;
using PowerStore.Domain.Entities;

namespace PowerStore.Infrastructure.Data;

public class DbSeeder
{
    private readonly PowerStoreDbContext _context;
    private readonly UserManager<UserEntity> _userManager;
    private readonly RoleManager<RoleEntity> _roleManager;

    public DbSeeder(
        PowerStoreDbContext context,
        UserManager<UserEntity> userManager,
        RoleManager<RoleEntity> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedAsync()
    {
        await SeedRolesAsync();
        await SeedUsersAsync();
        await SeedCategoriesAsync();
        await SeedProductsAsync();
        await SeedProductImagesAsync();
    }

    private async Task SeedRolesAsync()
    {
        foreach (var role in Roles.All)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new RoleEntity { Name = role });
            }
        }
    }

    private async Task SeedUsersAsync()
    {
        if (_userManager.Users.Any())
            return;

        var admin = new UserEntity
        {
            Id = Guid.NewGuid(),
            UserName = "Admin",
            Email = "admin@gmail.com",
            FirstName = "Doris",
            LastName = "Lewicki",
            Image = "https://www.mamp.one/wp-content/uploads/2024/09/image-resources2.jpg",
            EmailConfirmed = true
        };

        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            UserName = "User",
            Email = "user@gmail.com",
            FirstName = "Test",
            LastName = "User",
            Image = "https://webupon.com/wp-content/uploads/2024/02/SampleImage1-Dog-small.png",
            EmailConfirmed = true
        };

        var resultAdmin = await _userManager.CreateAsync(admin, "Qwerty123!");
        if (!resultAdmin.Succeeded)
            throw new Exception(string.Join(", ", resultAdmin.Errors.Select(e => e.Description)));

        var resultUser = await _userManager.CreateAsync(user, "User123!");
        if (!resultUser.Succeeded)
            throw new Exception(string.Join(", ", resultUser.Errors.Select(e => e.Description)));

        await _userManager.AddToRoleAsync(admin, Roles.Admin);
        await _userManager.AddToRoleAsync(user, Roles.User);

        Console.WriteLine($"Users seeded: {admin.UserName}, {user.UserName}");
    }

    private async Task SeedCategoriesAsync()
    {
        if (_context.Categories.Any()) return;

        var categories = new List<CategoryEntity>
        {
            new() { Name = "Cables", Description = "All types of cables" },
            new() { Name = "Lighting", Description = "Lamps and lighting" },
            new() { Name = "Switches", Description = "Electrical switches" },
            new() { Name = "Sockets", Description = "Wall sockets" },
            new() { Name = "Tools", Description = "Electrical tools" }
        };

        await _context.Categories.AddRangeAsync(categories);
        await _context.SaveChangesAsync();
    }

    private async Task SeedProductsAsync()
    {
        if (_context.Products.Any()) return;

        var categories = await _context.Categories.ToListAsync();

        var products = new List<ProductEntity>
        {
            new() { Name = "USB Cable Type-C", Price = 10, StockQuantity = 100, CategoryId = categories[0].Id },
            new() { Name = "HDMI Cable 2m", Price = 15, StockQuantity = 80, CategoryId = categories[0].Id },
            new() { Name = "Ethernet Cable Cat6", Price = 12, StockQuantity = 120, CategoryId = categories[0].Id },

            new() { Name = "LED Bulb 10W", Price = 5, StockQuantity = 200, CategoryId = categories[1].Id },
            new() { Name = "Desk Lamp", Price = 25, StockQuantity = 50, CategoryId = categories[1].Id },

            new() { Name = "Single Switch", Price = 3, StockQuantity = 150, CategoryId = categories[2].Id },

            new() { Name = "Wall Socket EU", Price = 4, StockQuantity = 160, CategoryId = categories[3].Id },

            new() { Name = "Voltage Tester", Price = 8, StockQuantity = 70, CategoryId = categories[4].Id }
        };

        await _context.Products.AddRangeAsync(products);
        await _context.SaveChangesAsync();
    }

    private async Task SeedProductImagesAsync()
    {
        if (_context.ProductImages.Any()) return;

        var products = await _context.Products.ToListAsync();

        var images = products.Select((p, i) => new ProductImageEntity
        {
            ProductId = p.Id,
            Image = $"https://picsum.photos/seed/{i}/400/300",
            DisplayOrder = 0
        });

        await _context.ProductImages.AddRangeAsync(images);
        await _context.SaveChangesAsync();
    }
}