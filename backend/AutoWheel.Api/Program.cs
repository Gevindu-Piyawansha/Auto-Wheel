using AutoWheel.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (hardcoded for production reliability)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://auto-wheel-sl.web.app", "http://localhost:3000")
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

// Health check endpoint
app.MapGet("/", () => new { status = "API is running", timestamp = DateTime.UtcNow })
   .RequireCors();

app.MapControllers();

// Auto-migrate database on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        Console.WriteLine("Starting database setup...");
        
        // Drop all tables and recreate with new schema
        Console.WriteLine("Recreating database schema...");
        var sqlDropTables = @"
            DROP TABLE IF EXISTS ""Cars"" CASCADE;
            DROP TABLE IF EXISTS ""Inquiries"" CASCADE;
            DROP TABLE IF EXISTS ""SuccessStories"" CASCADE;
        ";
        db.Database.ExecuteSqlRaw(sqlDropTables);
        Console.WriteLine("Old tables dropped.");
        
        // Create tables with new schema
        db.Database.EnsureCreated();
        Console.WriteLine("Database and tables created successfully with new schema.");
        
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
