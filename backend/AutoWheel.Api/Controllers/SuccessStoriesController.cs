using AutoWheel.Domain.Entities;
using AutoWheel.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoWheel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuccessStoriesController(AutoWheelDbContext db) : ControllerBase
{
    // GET: api/successstories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SuccessStory>>> GetStories()
        => await db.SuccessStories.AsNoTracking().OrderByDescending(s => s.Id).ToListAsync();

    // GET: api/successstories/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<SuccessStory>> GetStory(int id)
    {
        var story = await db.SuccessStories.FindAsync(id);
        return story is null ? NotFound() : story;
    }

    // POST: api/successstories
    [HttpPost]
    public async Task<ActionResult<SuccessStory>> CreateStory([FromBody] SuccessStory story)
    {
        db.SuccessStories.Add(story);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetStory), new { id = story.Id }, story);
    }

    // PUT: api/successstories/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateStory(int id, [FromBody] SuccessStory story)
    {
        if (id != story.Id) return BadRequest();
        db.Entry(story).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/successstories/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteStory(int id)
    {
        var story = await db.SuccessStories.FindAsync(id);
        if (story is null) return NotFound();
        db.SuccessStories.Remove(story);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
