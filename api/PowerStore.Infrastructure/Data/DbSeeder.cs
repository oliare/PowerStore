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
            UserName = "Admin",
            Email = "admin@gmail.com",
            FirstName = "Doris",
            LastName = "Lewicki",
            Image = "/image-resources2.jpg",
            EmailConfirmed = true
        };

        var user = new UserEntity
        {
            UserName = "User",
            Email = "user@gmail.com",
            FirstName = "Test",
            LastName = "User",
            Image = "/SampleImage1-Dog-small.png",
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

        var cabling = new CategoryEntity
        {
            Name = "Кабельна продукція",
            Description = "Все для монтажу мереж",
            Image = "https://media.istockphoto.com/id/1150199550/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%96%D0%BD%D0%B6%D0%B5%D0%BD%D0%B5%D1%80-%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%B8%D0%BA-%D0%BF%D1%80%D0%B0%D1%86%D1%8E%D1%94-%D1%82%D0%B5%D1%81%D1%82%D0%B5%D1%80%D0%BE%D0%BC-%D1%89%D0%BE-%D0%B2%D0%B8%D0%BC%D1%96%D1%80%D1%8E%D1%94-%D0%BD%D0%B0%D0%BF%D1%80%D1%83%D0%B3%D1%83-%D1%96-%D1%81%D1%82%D1%80%D1%83%D0%BC-%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%B8%D1%87%D0%BD%D0%BE%D1%97-%D0%BB%D1%96%D0%BD%D1%96%D1%97-%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%D0%B0%D1%87-%D0%B2.jpg?s=612x612&w=0&k=20&c=LToBdaP1afPEsp_XNqs0g_pWvs0Jmvp2E-RBqfvqFMw="
        };
        var lighting = new CategoryEntity
        {
            Name = "Освітлення",
            Description = "Лампи та світильники",
            Image = "https://media.istockphoto.com/id/1934009955/uk/%D1%84%D0%BE%D1%82%D0%BE/%D0%BC%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0-%D0%B6%D1%96%D0%BD%D0%BA%D0%B0-%D0%B7%D0%BC%D1%96%D0%BD%D1%8E%D1%94-%D0%BB%D0%B0%D0%BC%D0%BF%D0%BE%D1%87%D0%BA%D1%83-%D0%B7-%D0%BB%D0%B0%D0%BC%D0%BF%D0%B8-%D1%80%D0%BE%D0%B7%D0%B6%D0%B0%D1%80%D1%8E%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F-%D0%BD%D0%B0-%D1%81%D0%B2%D1%96%D1%82%D0%BB%D0%BE%D0%B4%D1%96%D0%BE%D0%B4%D0%BD%D1%83.jpg?s=612x612&w=0&k=20&c=mvRLvQXTgmY4PzCvLs5SP_J8L1KLBhgWXzHnYsaIKA0="
        };
        var tools = new CategoryEntity
        {
            Name = "Інструменти",
            Description = "Електроінструмент",
            Image = "https://media.istockphoto.com/id/1186871403/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%81%D0%B2%D0%B5%D1%80%D0%B4%D0%BB%D0%B0-%D1%82%D0%B0-%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D1%96%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B8-%D0%B2-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D1%96.jpg?s=612x612&w=0&k=20&c=6mVBdJyyki_S5iemNaXv5cne_QiV1no9FMI0jWHZLpg="
        };
        var smartHome = new CategoryEntity
        {
            Name = "Розумний дім",
            Description = "Датчики та контролери",
            Image = "https://media.istockphoto.com/id/870664542/uk/%D1%84%D0%BE%D1%82%D0%BE/stem-%D0%B0%D0%B1%D0%BE-diy-%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%BD%D0%B8%D0%B9-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%82-%D0%BB%D1%96%D0%BD%D1%96%D1%8F-%D0%B2%D1%96%D0%B4%D1%81%D1%82%D0%B5%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F-%D1%85%D0%BE%D0%B4%D1%8C%D0%B1%D0%B8-%D1%80%D0%BE%D0%B1%D0%BE%D1%82-%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%D1%80%D0%B5%D0%BD%D1%86%D1%96%D1%97-%D1%96%D0%B4%D0%B5%D1%97.jpg?s=612x612&w=0&k=20&c=p5KnhZyUw2HM0gIbkolQBePESIMm1_VVxD909ze2pBI="
        };
        var sockets = new CategoryEntity
        {
            Name = "Розетки та вимикачі",
            Description = "Електрофурнітура",
            Image = "https://media.istockphoto.com/id/1288881663/uk/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D1%96-%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%BD%D1%8F/%D1%80%D0%BE%D0%B7%D0%B5%D1%82%D0%BA%D0%B8-%D0%B2%D0%B8%D0%BC%D0%B8%D0%BA%D0%B0%D1%87%D1%96-%D1%81%D0%B2%D1%96%D1%82%D0%BB%D0%B0-%D0%BD%D0%B0%D1%80%D1%8F%D0%B4%D0%B8-%D1%80%D1%96%D0%B7%D0%BD%D0%BE%D0%B3%D0%BE-%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D1%83-%D1%80%D0%B5%D0%B0%D0%BB%D1%96%D1%81%D1%82%D0%B8%D1%87%D0%BD%D0%BE%D0%B3%D0%BE-%D0%BD%D0%B0%D0%B1%D0%BE%D1%80%D1%83.jpg?s=612x612&w=0&k=20&c=FzoI7E3S9wvtVScDlO0lZ8QcpSK85FDe3g0hGhwNEaQ="
        };
        var protection = new CategoryEntity
        {
            Name = "Автоматика",
            Description = "Захист та щитове обладнання",
            Image = "https://media.istockphoto.com/id/950865552/uk/%D1%84%D0%BE%D1%82%D0%BE/%D0%BF%D0%BB%D0%B0%D1%81%D1%82%D0%B8%D0%BA%D0%BE%D0%B2%D1%96-%D0%BA%D0%BE%D1%80%D0%BE%D0%B1%D0%BA%D0%B8-%D0%B4%D0%BB%D1%8F-%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BC%D0%BE%D0%BD%D1%82%D0%B0%D0%B6%D1%83-%D0%B2-%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D1%96.jpg?s=612x612&w=0&k=20&c=R2Ya4lnn13ZrcSxz2jhZA8XbbdIMnupE2wGrbPAsxg0="
        };


        await _context.Categories.AddRangeAsync(cabling, lighting, tools, smartHome, sockets, protection);

        await _context.SaveChangesAsync();

        var subCategories = new List<CategoryEntity>
        {
            new() { Name = "Силовий кабель", ParentId = cabling.Id },
            new() { Name = "Кручена пара (LAN)", ParentId = cabling.Id },
            new() { Name = "Кабель-канали", ParentId = cabling.Id },

            new() { Name = "LED Стрічки", ParentId = lighting.Id },
            new() { Name = "Вуличні ліхтарі", ParentId = lighting.Id },

            new() { Name = "Вимірювальні прилади", ParentId = tools.Id },
            new() { Name = "Викрутки та плоскогубці", ParentId = tools.Id },

            new() { Name = "Датчики руху та витоку", ParentId = smartHome.Id },
            new() { Name = "Розумні реле та хаби", ParentId = smartHome.Id },
            new() { Name = "Системи відеоспостереження", ParentId = smartHome.Id },

            new() { Name = "Внутрішні розетки", ParentId = sockets.Id },
            new() { Name = "Сенсорні вимикачі", ParentId = sockets.Id },
            new() { Name = "Рамки та аксесуари", ParentId = sockets.Id },

            new() { Name = "Автоматичні вимикачі", ParentId = protection.Id },
            new() { Name = "Пристрої захисного вимкнення (ПЗВ)", ParentId = protection.Id },
            new() { Name = "Електричні щити та бокси", ParentId = protection.Id }
        };

        await _context.Categories.AddRangeAsync(subCategories);
        await _context.SaveChangesAsync();
    }
    private async Task SeedProductsAsync()
    {
        if (_context.Products.Any()) return;

        var categories = await _context.Categories.ToListAsync();

        var products = new List<ProductEntity>
        {
            new() { Name = "USB Кабель Type-C", Price = 10, StockQuantity = 100, CategoryId = categories[0].Id ,Brand = "Baseus",
            Tags = "4K,Video,HDMI 2.1"
        },
            new() { Name = "HDMI Кабель 2m", Price = 15, StockQuantity = 80, CategoryId = categories[0].Id
            ,Brand = "Ugreen",
            Tags = "LAN,Мережа,Інтернет"
        },
            new() { Name = "Ethernet Кабель Cat6", Price = 12, StockQuantity = 120, CategoryId = categories[0].Id,Brand = "Philips",
            Tags = "E27,Економна,Тепле світло"
        },

            new() { Name = "LED Лампа 10W", Price = 5, StockQuantity = 200, CategoryId = categories[1].Id },
            new() { Name = "Настільна лампа", Price = 25, StockQuantity = 50, CategoryId = categories[1].Id,Brand = "Xiaomi",
            Tags = "Smart,Освітлення,Робота"
        },

            new() { Name = "Одинарний вимикач", Price = 3, StockQuantity = 150, CategoryId = categories[2].Id,Brand = "Schneider Electric",
            Tags = "Фурнітура,Білий,Classic"
        },

            new() { Name = "Настінна мережева розетка EU", Price = 4, StockQuantity = 160, CategoryId = categories[3].Id,Brand = "Legrand",
            Tags = "Розетка,Заземлення,Монтаж"
        },

            new() { Name = "Тестер рівня напруги", Price = 8, StockQuantity = 70, CategoryId = categories[4].Id,Brand = "UNI-T",
            Tags = "Вимірювання,Електрика,Інструмент"
        },

            new() { Name = "Датчик затоплення ZigBee", Price = 480, StockQuantity = 60, CategoryId = categories[5].Id,Brand = "Aqara",
            Tags = "Smart Home,ZigBee,Безпека"
        },
            new() { Name = "Датчик відкриття дверей/вікна", Price = 320, StockQuantity = 100, CategoryId = categories[5].Id, Brand = "Sonoff",
            Tags = "WiFi,Безпека,Розумний дім"
        },

           new() { Name = "Автомат 1P 16A Type C 6kA", Price = 115, StockQuantity = 120, CategoryId = categories[6].Id, Brand = "Eaton",
                DiscountPercentage = 20, IsOnSale = false,  
                Tags = "Захист,Автоматика,Щит" },

            new() { Name = "Автомат 1P 25A Type C 6kA", Price = 115, StockQuantity = 80, CategoryId = categories[6].Id, Brand = "ABB",
                DiscountPercentage = 20, IsOnSale = true,
                DiscountPrice = Math.Round(115 * (1 - 20m / 100), 2),
                Tags = "Захист,Надійність,Professional" },

            new() { Name = "Сенсорний вимикач 1-клавішний WiFi", Price = 650, StockQuantity = 45, CategoryId = categories[7].Id, Brand = "Livolo",
                DiscountPercentage = 20, IsOnSale = true,
                DiscountPrice = Math.Round(650 * (1 - 20m / 100), 2),  
                Tags = "Сенсор,WiFi,Modern" },
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