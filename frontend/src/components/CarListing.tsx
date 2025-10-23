import React, { useState } from 'react';
import { Search, Filter, Grid, List, MapPin, Calendar, Fuel, Settings } from 'lucide-react';

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  tax?: number;
  totalPrice?: number;
  mileage: number;
  engineCC: string;
  fuelType: string;
  transmission: string;
  vehicleGrade: string;
  category: string;
  location: string;
  image: string;
  features: string[];
  description: string;
  isHotDeal?: boolean;
  views?: number;
  rating?: number;
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
    fuelType: '',
    category: '',
    engineCC: '',
    vehicleGrade: '',
    transmission: '',
    isHotDeal: false
  });



  const filteredCars = cars.filter(car => {
    const matchesSearch = (
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.engineCC?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesMake = filters.make === '' || car.make === filters.make;
    const matchesFuelType = filters.fuelType === '' || car.fuelType === filters.fuelType;
    const matchesCategory = filters.category === '' || car.category === filters.category;
    const matchesEngineCC = filters.engineCC === '' || car.engineCC === filters.engineCC;
    const matchesVehicleGrade = filters.vehicleGrade === '' || car.vehicleGrade === filters.vehicleGrade;
    const matchesTransmission = filters.transmission === '' || car.transmission === filters.transmission;
    const matchesHotDeal = !filters.isHotDeal || car.isHotDeal;
    
    const minPrice = parseInt(filters.minPrice) || 0;
    const maxPrice = parseInt(filters.maxPrice) || Infinity;
    const matchesPrice = car.price >= minPrice && car.price <= maxPrice;
    
    return matchesSearch && matchesMake && matchesFuelType && matchesCategory && 
           matchesEngineCC && matchesVehicleGrade && matchesTransmission && 
           matchesHotDeal && matchesPrice;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const CarCard: React.FC<{ car: Car }> = ({ car }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="relative">
        <img 
          src={car.image} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
        />
        {car.isHotDeal && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
            🔥 HOT DEAL
          </div>
        )}
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
          {formatPrice(car.price)}
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {car.views || 0} views
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            {car.make.toUpperCase()} {car.model.toUpperCase()}
          </h3>
          <div className="flex items-center text-yellow-400 text-sm">
            {"⭐".repeat(car.rating || 5)}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-1">
          {car.category}
        </div>
        
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 mb-3">
          <div><span className="font-medium">Year:</span> {car.year}</div>
          <div><span className="font-medium">Mileage:</span> {car.mileage?.toLocaleString() || 0}km</div>
          <div><span className="font-medium">Fuel:</span> {car.fuelType}</div>
          <div><span className="font-medium">Grade:</span> {car.vehicleGrade}</div>
          <div><span className="font-medium">Transmission:</span> {car.transmission}</div>
          <div><span className="font-medium">Engine:</span> {car.engineCC}</div>
        </div>
        
        <p className="text-gray-700 text-xs mb-3 line-clamp-2">
          {car.description}
        </p>
        
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Car Features:</div>
          <div className="flex flex-wrap gap-1">
            {car.features.slice(0, 6).map((feature, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-200">
                {feature}
              </span>
            ))}
            {car.features.length > 6 && (
              <span className="text-blue-600 text-xs font-medium">+{car.features.length - 6} more features</span>
            )}
          </div>
        </div>
        
        <div className="border-t pt-3 mt-3">
          <div className="text-center mb-2">
            <div className="text-lg font-bold text-gray-900">
              Base Price: {formatPrice(car.price)}
            </div>
            {car.tax && car.tax > 0 && (
              <div className="text-sm text-gray-600">
                Total Price: {formatPrice(car.price + car.tax)}
              </div>
            )}
          </div>
          <div className="text-center text-xs text-green-600 mb-2">
            💰 Leasing Available | 🚚 Free Delivery
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300 text-sm font-medium">
            📞 Contact Us About This Car
          </button>
        </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Wagon">Wagon</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Van">Van</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine CC</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={filters.engineCC}
                    onChange={(e) => setFilters({...filters, engineCC: e.target.value})}
                  >
                    <option value="">All Engines</option>
                    <option value="660cc">660cc</option>
                    <option value="1000cc">1000cc</option>
                    <option value="1200cc">1200cc</option>
                    <option value="1500cc">1500cc</option>
                    <option value="1800cc">1800cc</option>
                    <option value="2000cc">2000cc</option>
                    <option value="2500cc">2500cc+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Grade</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={filters.vehicleGrade}
                    onChange={(e) => setFilters({...filters, vehicleGrade: e.target.value})}
                  >
                    <option value="">All Grades</option>
                    <option value="L">L Grade</option>
                    <option value="G">G Grade</option>
                    <option value="X">X Grade</option>
                    <option value="S">S Grade</option>
                    <option value="Z">Z Grade</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.isHotDeal}
                      onChange={(e) => setFilters({...filters, isHotDeal: e.target.checked})}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">🔥 Hot Deals Only</span>
                  </label>
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
                  onClick={() => setFilters({
                    minPrice: '', maxPrice: '', make: '', year: '', fuelType: '',
                    category: '', engineCC: '', vehicleGrade: '', transmission: '', isHotDeal: false
                  })}
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