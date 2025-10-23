import React, { useState } from 'react';
import { Car } from './CarListing';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardProps {
  cars: Car[];
  onAddCar: (car: Omit<Car, 'id'>) => void;
  onEditCar: (id: number, car: Partial<Car>) => void;
  onDeleteCar: (id: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  cars,
  onAddCar,
  onEditCar,
  onDeleteCar
}) => {
  const { user, isAdmin } = useAuth();
  
  // All hooks must be called before any conditional returns
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    tax: 0,
    mileage: 0,
    engineCC: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    vehicleGrade: 'G',
    category: 'Hatchback',
    image: '',
    features: [],
    description: '',
    isHotDeal: false,
    views: 0,
    rating: 5
  });

  // Check admin access after all hooks are called
  if (!user || !isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500">Please login as an administrator to continue.</p>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      tax: 0,
      mileage: 0,
      engineCC: '',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      vehicleGrade: 'G',
      category: 'Hatchbook',
      image: '',
      features: [],
      description: '',
      isHotDeal: false,
      views: 0,
      rating: 5
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onEditCar(editingId, formData);
      setEditingId(null);
    } else {
      onAddCar(formData as Omit<Car, 'id'>);
      setIsAddingCar(false);
    }
    resetForm();
  };

  const handleEdit = (car: Car) => {
    setFormData(car);
    setEditingId(car.id);
    setIsAddingCar(true);
  };

  const handleCancel = () => {
    setIsAddingCar(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => setIsAddingCar(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Car
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Car Form */}
        {isAddingCar && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Car' : 'Add New Car'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                <select
                  value={formData.make}
                  onChange={(e) => setFormData({...formData, make: e.target.value, model: ''})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Brand</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Daihatsu">Daihatsu</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Infiniti">Infiniti</option>
                  <option value="Acura">Acura</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                <div className="relative">
                  <input
                    type="text"
                    list={`models-${formData.make}`}
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder={formData.make ? "Select or type model..." : "Select brand first"}
                    required
                  />
                  <datalist id={`models-${formData.make}`}>
                    {formData.make === 'Toyota' && (
                      <>
                        <option value="Prius" />
                        <option value="Camry" />
                        <option value="Corolla" />
                        <option value="Vitz" />
                        <option value="Aqua" />
                        <option value="Raize" />
                        <option value="C-HR" />
                        <option value="Harrier" />
                        <option value="Land Cruiser" />
                        <option value="Hiace" />
                        <option value="Yaris" />
                        <option value="Fortuner" />
                        <option value="Alphard" />
                      </>
                    )}
                    {formData.make === 'Honda' && (
                      <>
                        <option value="Fit" />
                        <option value="Vezel" />
                        <option value="Freed" />
                        <option value="Grace" />
                        <option value="Shuttle" />
                        <option value="Civic" />
                        <option value="Accord" />
                        <option value="CR-V" />
                        <option value="Step WGN" />
                        <option value="Odyssey" />
                        <option value="Jazz" />
                      </>
                    )}
                    {formData.make === 'Nissan' && (
                      <>
                        <option value="March" />
                        <option value="Note" />
                        <option value="Aura" />
                        <option value="Tiida" />
                        <option value="X-Trail" />
                        <option value="Serena" />
                        <option value="Leaf" />
                        <option value="Kicks" />
                        <option value="Juke" />
                      </>
                    )}
                    {formData.make === 'Suzuki' && (
                      <>
                        <option value="Alto" />
                        <option value="Wagon R" />
                        <option value="Swift" />
                        <option value="Spacia" />
                        <option value="Hustler" />
                        <option value="Jimny" />
                        <option value="Escudo" />
                        <option value="Baleno" />
                      </>
                    )}
                    {formData.make === 'Daihatsu' && (
                      <>
                        <option value="Mira" />
                        <option value="Move" />
                        <option value="Tanto" />
                        <option value="Cast" />
                        <option value="Rocky" />
                        <option value="Hijet" />
                      </>
                    )}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Year</option>
                  {Array.from({length: 11}, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={formData.price}
                  onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value) || 0);
                    setFormData({...formData, price: value});
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 15000000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value) || 0})}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter mileage"
                    required
                  />
                  <select
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) {
                        setFormData({...formData, mileage: value});
                      }
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Quick Select</option>
                    <option value="1000">1,000 km</option>
                    <option value="2000">2,000 km</option>
                    <option value="5000">5,000 km</option>
                    <option value="10000">10,000 km</option>
                    <option value="20000">20,000 km</option>
                    <option value="30000">30,000 km</option>
                    <option value="50000">50,000 km</option>
                    <option value="75000">75,000 km</option>
                    <option value="100000">100,000 km</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Engine Capacity *</label>
                <div className="relative">
                  <input
                    type="text"
                    list="engine-capacity-list"
                    value={formData.engineCC}
                    onChange={(e) => setFormData({...formData, engineCC: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1500cc or type custom"
                    required
                  />
                  <datalist id="engine-capacity-list">
                    <option value="660cc" />
                    <option value="800cc" />
                    <option value="990cc" />
                    <option value="1000cc" />
                    <option value="1200cc" />
                    <option value="1300cc" />
                    <option value="1500cc" />
                    <option value="1600cc" />
                    <option value="1800cc" />
                    <option value="2000cc" />
                    <option value="2400cc" />
                    <option value="2500cc" />
                    <option value="3000cc" />
                    <option value="3500cc" />
                    <option value="4000cc" />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                >
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Grade</label>
                <div className="relative">
                  <input
                    type="text"
                    list="vehicle-grade-list"
                    value={formData.vehicleGrade}
                    onChange={(e) => setFormData({...formData, vehicleGrade: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., L, G, X or type custom"
                    required
                  />
                  <datalist id="vehicle-grade-list">
                    <option value="L" />
                    <option value="G" />
                    <option value="X" />
                    <option value="S" />
                    <option value="Z" />
                    <option value="Premium" />
                    <option value="Luxury" />
                    <option value="Base" />
                    <option value="Sport" />
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                  <option value="FAT">FAT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax (LKR)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.tax || 0}
                  onChange={(e) => setFormData({...formData, tax: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <select
                  value={formData.rating || 5}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isHotDeal || false}
                    onChange={(e) => setFormData({...formData, isHotDeal: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Mark as Hot Deal 🔥</span>
                </label>
              </div>

              {/* Location removed - Direct Import vehicles */}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Car Features</label>
                <div className="grid grid-cols-3 gap-2 border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                  {[
                    'Air Conditioning', 'Power Steering', 'Power Windows', 'ABS (Anti-lock Braking System)',
                    'Airbags', 'Backup Camera', 'Bluetooth', 'USB Port', 'Leather Seats', 'Sunroof',
                    'Alloy Wheels', 'Fog Lights', 'Keyless Entry', 'Push Start Button', 'Cruise Control',
                    'Navigation System', 'Parking Sensors', 'LED Headlights', 'Electric Side Mirrors',
                    'Central Locking', 'Child Safety Locks', 'Dual Airbags', 'Side Airbags', 'Traction Control',
                    'Stability Control', 'Hill Assist', 'Auto Headlights', 'Rain Sensing Wipers', 'Climate Control',
                    'Heated Seats', 'Wireless Charging', 'Apple CarPlay', 'Android Auto', 'Premium Sound System',
                    'Rear Entertainment', 'Blind Spot Monitor', 'Lane Keep Assist', 'Adaptive Cruise Control',
                    'Panoramic Sunroof', 'Xenon Headlights', 'Digital Display', 'Multi-function Steering',
                    'Automatic Transmission', 'CVT Transmission', 'Manual Transmission', '4WD', 'AWD',
                    'Hybrid System', 'EV Mode', 'Eco Mode', 'Sport Mode', 'Snow Mode'
                  ].map((feature) => (
                    <label key={feature} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.features?.includes(feature) || false}
                        onChange={(e) => {
                          const currentFeatures = formData.features || [];
                          if (e.target.checked) {
                            setFormData({...formData, features: [...currentFeatures, feature]});
                          } else {
                            setFormData({...formData, features: currentFeatures.filter(f => f !== feature)});
                          }
                        }}
                        className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs">{feature}</span>
                    </label>
                  ))}
                </div>
                
                {/* Custom Feature Input */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom feature (e.g., Premium Audio, Special Edition)"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        const customFeature = e.currentTarget.value.trim();
                        const currentFeatures = formData.features || [];
                        if (!currentFeatures.includes(customFeature)) {
                          setFormData({...formData, features: [...currentFeatures, customFeature]});
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input.value.trim()) {
                        const customFeature = input.value.trim();
                        const currentFeatures = formData.features || [];
                        if (!currentFeatures.includes(customFeature)) {
                          setFormData({...formData, features: [...currentFeatures, customFeature]});
                          input.value = '';
                        }
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Features Display */}
                {formData.features && formData.features.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Selected Features ({formData.features.length}):</p>
                    <div className="flex flex-wrap gap-1">
                          {(formData.features ?? []).map((feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                            >
                              {feature}
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    features: (formData.features ?? []).filter(f => f !== feature)
                                  });
                                }}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Images</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        // For now, we'll use the first file as the main image
                        // In a real app, you'd upload these to a server
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setFormData({...formData, image: event.target.result as string});
                          }
                        };
                        if (files[0]) {
                          reader.readAsDataURL(files[0]);
                        }
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Upload multiple car images (JPG, PNG, WebP). First image will be the main display image.
                  </p>
                  
                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-2">Preview:</p>
                      <img
                        src={formData.image}
                        alt="Car preview"
                        className="w-32 h-24 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cars Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Cars ({cars.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-16 rounded object-cover"
                          src={car.image}
                          alt={`${car.make} ${car.model}`}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {car.year} {car.make} {car.model}
                            {car.isHotDeal && (
                              <span className="ml-2 text-orange-500 font-bold">🔥 HOT</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {car.mileage?.toLocaleString() || 0} km • {car.engineCC} • {car.fuelType} • {car.category}
                          </div>
                          <div className="text-xs text-gray-400">
                            Grade: {car.vehicleGrade} • Views: {car.views || 0} • Rating: {car.rating || 5}⭐
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {new Intl.NumberFormat('en-LK', {
                          style: 'currency',
                          currency: 'LKR',
                          minimumFractionDigits: 0
                        }).format(car.price)}
                      </div>
                      {car.tax && car.tax > 0 && (
                        <div className="text-xs text-gray-500">
                          Tax: {new Intl.NumberFormat('en-LK', {
                            style: 'currency',
                            currency: 'LKR',
                            minimumFractionDigits: 0
                          }).format(car.tax)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {car.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteCar(car.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;