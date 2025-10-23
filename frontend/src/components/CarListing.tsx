import React, { useState } from 'react';
import { Search, Filter, Grid, List, MapPin, Calendar, Fuel, Settings } from 'lucide-react';

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  location: string;
  image: string;
  features: string[];
  description: string;
}

interface CarListingProps {
  cars: Car[];
}

const CarListing: React.FC<CarListingProps> = ({ cars }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    make: '',
    year: '',
    fuelType: ''
  });



  const filteredCars = cars.filter(car => {
    const matchesSearch = (
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesMake = filters.make === '' || car.make === filters.make;
    const matchesFuelType = filters.fuelType === '' || car.fuelType === filters.fuelType;
    
    const minPrice = parseInt(filters.minPrice) || 0;
    const maxPrice = parseInt(filters.maxPrice) || Infinity;
    const matchesPrice = car.price >= minPrice && car.price <= maxPrice;
    
    return matchesSearch && matchesMake && matchesFuelType && matchesPrice;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const CarCard: React.FC<{ car: Car }> = ({ car }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={car.image} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
          {formatPrice(car.price)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {car.year} {car.make} {car.model}
        </h3>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Settings className="w-4 h-4 mr-1" />
            {car.mileage.toLocaleString()} km
          </div>
          <div className="flex items-center">
            <Fuel className="w-4 h-4 mr-1" />
            {car.fuelType}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {car.year}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {car.location}
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {car.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {car.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {feature}
            </span>
          ))}
          {car.features.length > 3 && (
            <span className="text-gray-500 text-xs">+{car.features.length - 3} more</span>
          )}
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search and View Controls */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cars..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Filter className="w-5 h-5 mr-2 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={filters.make}
                    onChange={(e) => setFilters({...filters, make: e.target.value})}
                  >
                    <option value="">All Makes</option>
                    <option value="Toyota">Toyota</option>
                    <option value="BMW">BMW</option>
                    <option value="Tesla">Tesla</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={filters.fuelType}
                    onChange={(e) => setFilters({...filters, fuelType: e.target.value})}
                  >
                    <option value="">All Types</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (LKR)</label>
                  <input 
                    type="number"
                    min="0"
                    step="100000"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="1,000,000"
                    value={filters.minPrice}
                    onChange={(e) => {
                      const value = Math.max(0, parseInt(e.target.value) || 0);
                      setFilters({...filters, minPrice: value.toString()});
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (LKR)</label>
                  <input 
                    type="number"
                    min="0"
                    step="100000"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="50,000,000"
                    value={filters.maxPrice}
                    onChange={(e) => {
                      const value = Math.max(0, parseInt(e.target.value) || 0);
                      setFilters({...filters, maxPrice: value.toString()});
                    }}
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Price Ranges</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFilters({...filters, minPrice: '0', maxPrice: '5000000'})}
                      className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                    >
                      Under 5M
                    </button>
                    <button
                      onClick={() => setFilters({...filters, minPrice: '5000000', maxPrice: '15000000'})}
                      className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                    >
                      5M - 15M
                    </button>
                    <button
                      onClick={() => setFilters({...filters, minPrice: '15000000', maxPrice: '25000000'})}
                      className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                    >
                      15M - 25M
                    </button>
                    <button
                      onClick={() => setFilters({...filters, minPrice: '25000000', maxPrice: ''})}
                      className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                    >
                      25M+
                    </button>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Car Grid */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">{filteredCars.length} cars found</p>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500">
                <option>Sort by: Price (Low to High)</option>
                <option>Sort by: Price (High to Low)</option>
                <option>Sort by: Year (Newest)</option>
                <option>Sort by: Mileage (Lowest)</option>
              </select>
            </div>
            
            <div className={viewMode === 'grid' ? 
              "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : 
              "space-y-4"
            }>
              {filteredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            
            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
                <button 
                  onClick={() => setFilters({minPrice: '', maxPrice: '', make: '', year: '', fuelType: ''})}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarListing;