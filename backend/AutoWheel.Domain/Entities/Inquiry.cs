namespace AutoWheel.Domain.Entities;

public class Inquiry
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    // Car snapshot at time of inquiry (denormalized for simplicity)
    public int CarId { get; set; }
    public string CarMake { get; set; } = string.Empty;
    public string CarModel { get; set; } = string.Empty;
    public int CarYear { get; set; }
    public decimal CarPrice { get; set; }

    // Customer
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string CustomerLocation { get; set; } = string.Empty;
    public string CustomerMessage { get; set; } = string.Empty;

    // Metadata
    public string InquiryType { get; set; } = "general"; // general, price, test_drive, financing, trade_in
    public string PreferredContactMethod { get; set; } = "whatsapp";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "pending"; // pending, contacted, sold, cancelled
}
