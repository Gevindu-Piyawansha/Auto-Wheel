namespace AutoWheel.Api.Models;

public class Car
{
    public int Id { get; set; }
    public string? Make { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public decimal? Price { get; set; }
    public string? Mileage { get; set; }
    public string? FuelType { get; set; }
    public string? Transmission { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
}
