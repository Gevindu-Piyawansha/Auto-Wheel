using AutoWheel.Api.Data;
using AutoWheel.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoWheel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InquiriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public InquiriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Inquiry>>> GetInquiries()
    {
        return await _context.Inquiries.OrderByDescending(i => i.CreatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Inquiry>> GetInquiry(int id)
    {
        var inquiry = await _context.Inquiries.FindAsync(id);
        if (inquiry == null)
            return NotFound();
        
        return inquiry;
    }

    [HttpPost]
    public async Task<ActionResult<Inquiry>> CreateInquiry(Inquiry inquiry)
    {
        _context.Inquiries.Add(inquiry);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetInquiry), new { id = inquiry.Id }, inquiry);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInquiry(int id)
    {
        var inquiry = await _context.Inquiries.FindAsync(id);
        if (inquiry == null)
            return NotFound();

        _context.Inquiries.Remove(inquiry);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
