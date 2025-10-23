using AutoWheel.Domain.Entities;
using AutoWheel.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoWheel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController(AutoWheelDbContext db) : ControllerBase
{
    // GET: api/inquiries
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Inquiry>>> GetInquiries()
        => await db.Inquiries.AsNoTracking().OrderByDescending(i => i.Timestamp).ToListAsync();

    // POST: api/inquiries
    [HttpPost]
    public async Task<ActionResult<Inquiry>> CreateInquiry([FromBody] Inquiry inquiry)
    {
        inquiry.Id = string.IsNullOrWhiteSpace(inquiry.Id) ? Guid.NewGuid().ToString() : inquiry.Id;
        inquiry.Timestamp = DateTime.UtcNow;
        db.Inquiries.Add(inquiry);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetInquiries), new { id = inquiry.Id }, inquiry);
    }
}
