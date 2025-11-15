# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["AutoWheel.Api/AutoWheel.Api.csproj", "AutoWheel.Api/"]
COPY ["AutoWheel.Domain/AutoWheel.Domain.csproj", "AutoWheel.Domain/"]
COPY ["AutoWheel.Infrastructure/AutoWheel.Infrastructure.csproj", "AutoWheel.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "AutoWheel.Api/AutoWheel.Api.csproj"

# Copy all source files
COPY . .

# Build and publish
WORKDIR "/src/AutoWheel.Api"
RUN dotnet publish "AutoWheel.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Start the application
ENTRYPOINT ["dotnet", "AutoWheel.Api.dll"]
