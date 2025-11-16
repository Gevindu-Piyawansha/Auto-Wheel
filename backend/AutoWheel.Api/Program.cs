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
        
        // Simply ensure the database and tables are created
        var created = db.Database.EnsureCreated();
        if (created)
        {
            Console.WriteLine("Database and tables created successfully.");
        }
        else
        {
            Console.WriteLine("Database already exists.");
        }
        
        // Verify by counting records
        var carCount = db.Cars.Count();
        Console.WriteLine($"Database ready. Cars table has {carCount} records.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database setup failed: {ex.GetType().Name}: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner exception: {ex.InnerException.GetType().Name}: {ex.InnerException.Message}");
        }
    }
}

app.Run();
