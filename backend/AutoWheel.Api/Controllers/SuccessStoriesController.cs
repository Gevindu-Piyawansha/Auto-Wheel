using AutoWheel.Api.Data;
using AutoWheel.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoWheel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuccessStoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public SuccessStoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SuccessStory>>> GetSuccessStories()
    {
        return await _context.SuccessStories.OrderByDescending(s => s.CreatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SuccessStory>> GetSuccessStory(int id)
    {
        var story = await _context.SuccessStories.FindAsync(id);
        if (story == null)
            return NotFound();
        
        return story;
    }

    [HttpPost]
    public async Task<ActionResult<SuccessStory>> CreateSuccessStory(SuccessStory story)
    {
        _context.SuccessStories.Add(story);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSuccessStory), new { id = story.Id }, story);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSuccessStory(int id, SuccessStory story)
    {
        if (id != story.Id)
            return BadRequest();

        _context.Entry(story).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.SuccessStories.AnyAsync(s => s.Id == id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSuccessStory(int id)
    {
        var story = await _context.SuccessStories.FindAsync(id);
        if (story == null)
            return NotFound();

        _context.SuccessStories.Remove(story);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
