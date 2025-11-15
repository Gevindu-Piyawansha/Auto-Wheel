namespace AutoWheel.Api.Models;

public class Inquiry
{
    public int Id { get; set; }
    public required string CustomerName { get; set; }
    public required string CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public required string Message { get; set; }
    public int CarId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
