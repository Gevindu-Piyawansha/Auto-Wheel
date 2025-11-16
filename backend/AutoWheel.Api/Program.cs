using AutoWheel.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
var allowedOrigins = builder.Configuration.GetValue<string>("Cors:AllowedOrigins")?.Split(',')
    ?? new[] { "http://localhost:3000", "https://auto-wheel-sl.web.app" };

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.MapControllers();

// Health check endpoint
app.MapGet("/", () => new { status = "API is running", timestamp = DateTime.UtcNow });

// Auto-migrate database on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        Console.WriteLine("Starting database setup...");
        
        // First, try to run migrations normally
        db.Database.Migrate();
        Console.WriteLine("Migrations applied successfully");
        
        // Verify tables exist by trying a simple query
        try
        {
            var carCount = db.Cars.Count();
            Console.WriteLine($"Database verified. Cars table exists with {carCount} records.");
        }
        catch (Exception)
        {
            Console.WriteLine($"Tables don't exist after migration. Creating manually...");
            
            // Drop and recreate the entire database schema
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
            
            Console.WriteLine("Database recreated successfully");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database setup failed: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
    }
}

app.Run();
