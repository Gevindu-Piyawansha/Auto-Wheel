using AutoWheel.Domain.Entities;
using AutoWheel.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoWheel.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController(AutoWheelDbContext db) : ControllerBase
{
    // GET: api/cars
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Car>>> GetCars()
        => await db.Cars.AsNoTracking() .OrderByDescending(c => c.Id) .ToListAsync();

    // GET: api/cars/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Car>> GetCar(int id)
    {
        var car = await db.Cars.FindAsync(id);
        return car is null ? NotFound() : car;
    }

    // POST: api/cars
    [HttpPost]
    public async Task<ActionResult<Car>> CreateCar([FromBody] Car car)
    {
        db.Cars.Add(car);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
    }

    // PUT: api/cars/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCar(int id, [FromBody] Car car)
    {
        if (id != car.Id) return BadRequest();
        db.Entry(car).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/cars/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCar(int id)
    {
        var car = await db.Cars.FindAsync(id);
        if (car is null) return NotFound();
        db.Cars.Remove(car);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
