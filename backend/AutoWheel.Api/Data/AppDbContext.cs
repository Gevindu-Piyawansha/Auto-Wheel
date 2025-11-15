using AutoWheel.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoWheel.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Car> Cars => Set<Car>();
    public DbSet<Inquiry> Inquiries => Set<Inquiry>();
    public DbSet<SuccessStory> SuccessStories => Set<SuccessStory>();
}
