namespace AutoWheel.Domain.Entities;

public class Car
{
    public int Id { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal Price { get; set; }
    public int Mileage { get; set; }
    public string EngineCC { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string VehicleGrade { get; set; } = "G";
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsHotDeal { get; set; }
    public int Views { get; set; }
    public int Rating { get; set; } = 5;
    public string Description { get; set; } = string.Empty;
}
