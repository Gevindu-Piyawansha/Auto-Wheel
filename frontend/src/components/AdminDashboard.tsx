import React, { useState, useEffect } from 'react';
import { Car } from './CarListing';
import { Plus, Edit, Trash2, Save, X, MessageSquare, RefreshCw, Star } from 'lucide-react';
import AdminSuccessStoryForm from './AdminSuccessStoryForm';
import { useAuth } from '../context/AuthContext';
import { uploadCarImage } from '../utils/imageUpload';

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
  const [activeTab, setActiveTab] = useState<'cars' | 'inquiries' | 'stories'>('cars');
  const [successStories, setSuccessStories] = useState<Array<{
    customerName: string;
    location: string;
    photo: string | null;
    description: string;
  }>>(() => {
    const raw = localStorage.getItem('successStories');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
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

  // Load inquiries from localStorage on component mount and when refreshKey changes
  useEffect(() => {
    const loadInquiries = () => {
      const savedInquiries = localStorage.getItem('carInquiries');
      console.log('AdminDashboard - Loading inquiries from localStorage:', savedInquiries);
      if (savedInquiries) {
        try {
          const parsed = JSON.parse(savedInquiries);
          console.log('AdminDashboard - Parsed inquiries:', parsed.length, 'items');
          console.log('AdminDashboard - Inquiry data:', parsed);
          setInquiries(parsed);
        } catch (error) {
          console.error('Error loading inquiries:', error);
          setInquiries([]);
        }
      } else {
        console.log('AdminDashboard - No inquiries found in localStorage');
        setInquiries([]);
      }
    };

    loadInquiries();

    // Listen for storage events (when localStorage is updated from another tab/component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'carInquiries') {
        console.log('AdminDashboard - Storage event detected, reloading inquiries');
        loadInquiries();
      }
    };

    // Listen for custom inquiriesUpdated event
    const handleInquiriesUpdated = () => {
      console.log('AdminDashboard - inquiriesUpdated event detected, reloading');
      loadInquiries();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('inquiriesUpdated', handleInquiriesUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inquiriesUpdated', handleInquiriesUpdated);
    };
  }, [refreshKey]);

  // Also reload inquiries when switching to inquiries tab
  useEffect(() => {
    if (activeTab === 'inquiries') {
      const savedInquiries = localStorage.getItem('carInquiries');
      console.log('AdminDashboard - Switched to inquiries tab, reloading:', savedInquiries);
      if (savedInquiries) {
        try {
          const parsed = JSON.parse(savedInquiries);
          setInquiries(parsed);
        } catch (error) {
          console.error('Error loading inquiries on tab switch:', error);
        }
      }
    }
  }, [activeTab]);

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

  const updateInquiryStatus = (inquiryId: string, status: string) => {
    setInquiries(prev => {
      const updated = prev.map(inquiry => 
        inquiry.id === inquiryId ? { ...inquiry, status } : inquiry
      );
      // Save to localStorage after updating
      localStorage.setItem('carInquiries', JSON.stringify(updated));
      console.log('Updated inquiry status and saved to localStorage');
      return updated;
    });
  };

  const deleteInquiry = (inquiryId: string) => {
    setInquiries(prev => {
      const updated = prev.filter(inquiry => inquiry.id !== inquiryId);
      // Save to localStorage after deleting
      localStorage.setItem('carInquiries', JSON.stringify(updated));
      console.log('Deleted inquiry and saved to localStorage');
      return updated;
    });
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
            {activeTab === 'cars' && (
              <button
                onClick={() => setIsAddingCar(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Car
              </button>
            )}
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('cars')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cars'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cars ({cars.length})
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inquiries'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Inquiries ({inquiries.length})
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Success Stories <Star className="inline w-4 h-4 ml-1 text-yellow-500" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'cars' ? (
          <>
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
                      <button
                        type="button"
                        onClick={async () => {
                          setIsUploadingImage(true);
                          try {
                            const imageUrl = await uploadCarImage();
                            setFormData({...formData, image: imageUrl});
                            alert('Image uploaded successfully!');
                          } catch (error) {
                            console.error('Upload error:', error);
                            alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
                          } finally {
                            setIsUploadingImage(false);
                          }
                        }}
                        disabled={isUploadingImage}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isUploadingImage ? (
                          <>
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          '📷 Upload Image from Device'
                        )}
                      </button>
                      <p className="text-xs text-gray-500">
                        Click button to upload from device, camera, or URL. Images will be auto-cropped to 3:2 ratio (max 5MB).
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
          </>
  ) : activeTab === 'inquiries' ? (
          /* Inquiries Management */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Customer Inquiries ({inquiries.length})
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setRefreshKey(prev => prev + 1)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    title="Refresh inquiries"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm font-medium">Refresh</span>
                  </button>
                  <div className="text-sm text-gray-500">
                    Total inquiries received
                  </div>
                </div>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
                <p className="text-gray-500">Customer inquiries from WhatsApp contact will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Customer Details
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Contact Information
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Message & Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Car Information
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm">
                             <div className="font-medium text-gray-900">{inquiry.customerName}</div>
                             <div className="text-gray-500 text-xs mt-1">Inquiry #{inquiry.id.slice(-6)}</div>
                             <div className="flex items-center gap-1 mt-1">
                               <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                 {inquiry.inquiryType}
                               </span>
                               <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                                 {inquiry.preferredContact}
                               </span>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <div className="text-sm space-y-1">
                             <div className="flex items-center text-gray-600">
                               <span className="font-medium text-xs text-gray-500 w-16">Email:</span>
                               <a href={`mailto:${inquiry.customerEmail}`} className="text-blue-600 hover:text-blue-800">
                                 {inquiry.customerEmail}
                               </a>
                             </div>
                             <div className="flex items-center text-gray-600">
                               <span className="font-medium text-xs text-gray-500 w-16">Phone:</span>
                               <a href={`tel:${inquiry.customerPhone}`} className="text-blue-600 hover:text-blue-800">
                                 {inquiry.customerPhone}
                               </a>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <div className="text-sm">
                             <div className="text-gray-900 mb-2">
                               <span className="font-medium text-gray-500 text-xs">Message:</span>
                               <p className="mt-1 text-sm">{inquiry.customerMessage}</p>
                             </div>
                             <div className="flex items-center text-gray-600 text-xs">
                               <span className="font-medium text-gray-500">Location:</span>
                               <span className="ml-1">{inquiry.customerLocation}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {inquiry.carMake} {inquiry.carModel}
                            </div>
                            <div className="text-gray-500">
                              {new Intl.NumberFormat('en-LK', {
                                style: 'currency',
                                currency: 'LKR',
                                minimumFractionDigits: 0
                              }).format(inquiry.carPrice)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={inquiry.status}
                            onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                              inquiry.status === 'sold' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="sold">Sold</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(inquiry.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                const message = `Hi! I'm interested in the ${inquiry.carMake} ${inquiry.carModel} priced at ${new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(inquiry.carPrice)}. Can you provide more details about this vehicle?`;
                                const whatsappUrl = `https://wa.me/94777444976?text=${encodeURIComponent(message)}`;
                                window.open(whatsappUrl, '_blank');
                              }}
                              className="text-green-600 hover:text-green-700"
                              title="Contact via WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete inquiry"
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
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end mb-2">
              <button
                className="text-gray-500 hover:text-red-600 px-3 py-1 rounded border border-gray-300"
                onClick={() => setActiveTab('stories')}
              >
                Close
              </button>
            </div>
            <AdminSuccessStoryForm
              onAdd={story => {
                if (story.photo) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const newStory = { ...story, photo: typeof reader.result === 'string' ? reader.result : null };
                    setSuccessStories(prev => {
                      const updated = [...prev, newStory];
                      localStorage.setItem('successStories', JSON.stringify(updated));
                      return updated;
                    });
                  };
                  reader.readAsDataURL(story.photo as File);
                } else {
                  const newStory = { ...story, photo: null };
                  setSuccessStories(prev => {
                    const updated = [...prev, newStory];
                    localStorage.setItem('successStories', JSON.stringify(updated));
                    return updated;
                  });
                }
              }}
            />
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Added Success Stories</h3>
              {successStories.length === 0 ? (
                <p className="text-gray-500">No stories added yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {successStories.map((story, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center">
                      {story.photo && (
                        <img
                          src={story.photo}
                          alt={story.customerName + ' with car'}
                          className="w-40 h-32 object-cover rounded-lg shadow mb-2"
                        />
                      )}
                      <div className="font-semibold text-lg text-gray-800">{story.customerName}</div>
                      <div className="text-xs text-gray-500 mb-2">{story.location}</div>
                      <div className="italic text-gray-700 text-base mb-2">“{story.description}”</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;