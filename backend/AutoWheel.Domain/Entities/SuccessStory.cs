namespace AutoWheel.Domain.Entities;

public class SuccessStory
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Photo { get; set; } = string.Empty; // Cloudinary URL
    public string Description { get; set; } = string.Empty;
}
