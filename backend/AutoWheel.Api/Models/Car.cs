namespace AutoWheel.Api.Models;

public class Car
{
    public int Id { get; set; }
    public string? Make { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public decimal? Price { get; set; }
    public decimal? Tax { get; set; }
    public decimal? TotalPrice { get; set; }
    public int? Mileage { get; set; }
    public string? EngineCC { get; set; }
    public string? FuelType { get; set; }
    public string? Transmission { get; set; }
    public string? VehicleGrade { get; set; }
    public string? Category { get; set; }
    public string? Location { get; set; }
    public string? Image { get; set; }
    public string? Features { get; set; } // Store as JSON string
    public string? Description { get; set; }
    public bool? IsHotDeal { get; set; }
    public int? Views { get; set; }
    public double? Rating { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
}
