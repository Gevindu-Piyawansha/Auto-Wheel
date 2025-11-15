using AutoWheel.Api.Data;
using AutoWheel.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoWheel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CarsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Car>>> GetCars()
    {
        return await _context.Cars.OrderByDescending(c => c.CreatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Car>> GetCar(int id)
    {
        var car = await _context.Cars.FindAsync(id);
        if (car == null)
            return NotFound();
        
        return car;
    }

    [HttpPost]
    public async Task<ActionResult<Car>> CreateCar(Car car)
    {
        _context.Cars.Add(car);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCar(int id, Car car)
    {
        if (id != car.Id)
            return BadRequest();

        _context.Entry(car).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Cars.AnyAsync(c => c.Id == id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCar(int id)
    {
        var car = await _context.Cars.FindAsync(id);
        if (car == null)
            return NotFound();

        _context.Cars.Remove(car);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
