using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PowerStore.Application.Interfaces;
using PowerStore.Application.Services;
using PowerStore.Domain.Entities;
using PowerStore.Infrastructure.Data;
using PowerStore.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PowerStoreDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Add services to the container.
builder.Services.AddAutoMapper(cfg => { }, AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddScoped<DbSeeder>();

builder.Services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IMapper, Mapper>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    options.Password.RequiredLength = 6;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireDigit = true;
    options.User.RequireUniqueEmail = true;
})
.AddRoles<RoleEntity>()
.AddEntityFrameworkStores<PowerStoreDbContext>()
.AddDefaultTokenProviders();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PowerStoreDbContext>();
    var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();

    try
    {
        await db.Database.MigrateAsync();
        await seeder.SeedAsync();
        Console.WriteLine("Database ready");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error during DB initialization: {ex.Message}");
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
