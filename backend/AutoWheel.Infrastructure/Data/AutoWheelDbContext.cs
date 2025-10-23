using AutoWheel.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AutoWheel.Infrastructure.Data;

public class AutoWheelDbContext : DbContext
{
    public AutoWheelDbContext(DbContextOptions<AutoWheelDbContext> options) : base(options)
    {
    }

    public DbSet<Car> Cars => Set<Car>();
    public DbSet<Inquiry> Inquiries => Set<Inquiry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Car>(entity =>
        {
            entity.Property(p => p.Make).HasMaxLength(100);
            entity.Property(p => p.Model).HasMaxLength(100);
            entity.Property(p => p.EngineCC).HasMaxLength(20);
            entity.Property(p => p.FuelType).HasMaxLength(30);
            entity.Property(p => p.Transmission).HasMaxLength(30);
            entity.Property(p => p.VehicleGrade).HasMaxLength(30);
            entity.Property(p => p.Category).HasMaxLength(50);
            entity.Property(p => p.ImageUrl).HasMaxLength(2048);
        });

        modelBuilder.Entity<Inquiry>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.Id).HasMaxLength(64);
            entity.Property(i => i.CustomerName).HasMaxLength(200);
            entity.Property(i => i.CustomerEmail).HasMaxLength(200);
            entity.Property(i => i.CustomerPhone).HasMaxLength(50);
            entity.Property(i => i.CustomerLocation).HasMaxLength(100);
            entity.Property(i => i.CustomerMessage).HasMaxLength(2000);
            entity.Property(i => i.InquiryType).HasMaxLength(50);
            entity.Property(i => i.PreferredContactMethod).HasMaxLength(50);
            entity.Property(i => i.Status).HasMaxLength(50);
        });
    }
}
