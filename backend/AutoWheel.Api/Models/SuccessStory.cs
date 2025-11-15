namespace AutoWheel.Api.Models;

public class SuccessStory
{
    public int Id { get; set; }
    public required string CustomerName { get; set; }
    public required string Location { get; set; }
    public required string Photo { get; set; }
    public required string Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
