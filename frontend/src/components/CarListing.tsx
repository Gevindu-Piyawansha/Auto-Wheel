import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, X, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inquiryFormSchema, type InquiryFormData } from '../validation/inquirySchema';
import { CarCardSkeleton } from './Skeleton';
import { useDebounce } from '../hooks';

export interface Inquiry {
  id: string;
  carId: number;
  carMake: string;
  carModel: string;
  carYear: number;
  carPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
    customerLocation: string;
  customerMessage: string;
  inquiryType: 'general' | 'price' | 'test_drive' | 'financing' | 'trade_in';
  preferredContactMethod: 'whatsapp' | 'phone' | 'email';
  timestamp: string;
  status: 'open' | 'contacted' | 'in_progress' | 'solved' | 'closed';
  adminNotes?: string;
  followUpDate?: string;
}

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
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryCar, setInquiryCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
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

  // Load inquiries from localStorage on component mount
  useEffect(() => {
    const savedInquiries = localStorage.getItem('carInquiries');
    if (savedInquiries) {
      try {
        const parsedInquiries = JSON.parse(savedInquiries);
        setInquiries(parsedInquiries);
      } catch (error) {
        console.error('Error loading inquiries from localStorage:', error);
      }
    }
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Show searching indicator when typing
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  const filteredCars = cars.filter(car => {
    const matchesSearch = (
      car.make.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      car.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      car.category?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      car.engineCC?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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

  const handleInquiry = (car: Car) => {
    setInquiryCar(car);
    setShowInquiryForm(true);
  };

  const handleInquirySubmit = (inquiry: Inquiry) => {
    console.log('Submitting inquiry:', inquiry);
    
    // Save inquiry to local state
    const updatedInquiries = [...inquiries, inquiry];
    setInquiries(updatedInquiries);

    // Save to localStorage for persistence
    try {
      localStorage.setItem('carInquiries', JSON.stringify(updatedInquiries));
      console.log('Saved to localStorage. Total inquiries:', updatedInquiries.length);
      
      // Verify it was saved
      const saved = localStorage.getItem('carInquiries');
      console.log('Verification - localStorage has:', saved ? JSON.parse(saved).length : 0, 'inquiries');
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('inquiriesUpdated'));
      console.log('Dispatched inquiriesUpdated event');
    } catch (error) {
      console.error('Error saving inquiry to localStorage:', error);
      alert('⚠️ Error saving inquiry. Please try again.');
      return;
    }

    // Create WhatsApp message based on inquiry details
    let message = `Hi! I'm interested in the ${inquiry.carMake} ${inquiry.carModel} (${inquiry.carYear}) priced at ${formatPrice(inquiry.carPrice)}.\n\n`;
    message += `Customer Details:\n`;
    message += `Name: ${inquiry.customerName}\n`;
    message += `Email: ${inquiry.customerEmail}\n`;
    message += `Phone: ${inquiry.customerPhone}\n`;
    message += `Inquiry Type: ${inquiry.inquiryType.replace('_', ' ').toUpperCase()}\n`;
    if (inquiry.customerMessage) {
      message += `\nMessage: ${inquiry.customerMessage}\n`;
    }
    message += `\nPlease contact me via ${inquiry.preferredContactMethod.toUpperCase()}.`;

    const whatsappUrl = `https://wa.me/94777444976?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Show success message
    alert('✅ Inquiry submitted successfully! Your inquiry has been saved and will be reviewed by our team.');
  };

  const CarDetailModal: React.FC<{ car: Car; onClose: () => void }> = ({ car, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {car.make.toUpperCase()} {car.model.toUpperCase()} ({car.year})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Car Image */}
            <div>
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
              {car.isHotDeal && (
                <div className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold inline-block">
                  🔥 HOT DEAL
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="space-y-6">
              {/* Price Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Price Information</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span className="font-bold text-xl">{formatPrice(car.price)}</span>
                  </div>
                  {car.tax && car.tax > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Registration Tax:</span>
                        <span>{formatPrice(car.tax)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="font-semibold">Total Price:</span>
                        <span className="font-bold text-xl text-blue-600">{formatPrice(car.price + car.tax)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Basic Specifications */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Make:</span>
                    <p className="font-medium">{car.make}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Model:</span>
                    <p className="font-medium">{car.model}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Year:</span>
                    <p className="font-medium">{car.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="font-medium">{car.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Mileage:</span>
                    <p className="font-medium">{car.mileage?.toLocaleString() || 0} km</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Fuel Type:</span>
                    <p className="font-medium">{car.fuelType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Transmission:</span>
                    <p className="font-medium">{car.transmission}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Engine:</span>
                    <p className="font-medium">{car.engineCC}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Grade:</span>
                    <p className="font-medium">{car.vehicleGrade}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Rating:</span>
                    <p className="font-medium">{"⭐".repeat(car.rating || 5)}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{car.description}</p>
              </div>

              {/* Features */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleInquiry(car)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2 font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Make an Inquiry</span>
                </button>
                <div className="text-center text-sm text-gray-600">
                  💰 Leasing Available | 🚚 Free Delivery | 📞 Call for Best Price
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InquiryFormModal: React.FC<{ car: Car; onClose: () => void; onSubmit: (inquiry: Inquiry) => void }> = ({ car, onClose, onSubmit }) => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<InquiryFormData>({
      resolver: zodResolver(inquiryFormSchema),
      defaultValues: {
        inquiryType: 'general',
        preferredContactMethod: 'whatsapp',
      },
    });

    const onFormSubmit = (data: InquiryFormData) => {
      const inquiry: Inquiry = {
        id: Date.now().toString(),
        carId: car.id,
        carMake: car.make,
        carModel: car.model,
        carYear: car.year,
        carPrice: car.price,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
    customerLocation: data.customerLocation,
        customerMessage: data.customerMessage,
        inquiryType: data.inquiryType as Inquiry['inquiryType'],
        preferredContactMethod: data.preferredContactMethod as Inquiry['preferredContactMethod'],
        timestamp: new Date().toISOString(),
        status: 'open'
      };

      onSubmit(inquiry);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Make an Inquiry</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Car Info Summary */}
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-900">{car.make} {car.model} ({car.year})</h3>
              <p className="text-lg font-bold text-blue-600">{formatPrice(car.price)}</p>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  {...register('customerName')}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  {...register('customerEmail')}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.customerEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  {...register('customerPhone')}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+94 77 123 4567 (or any international number)"
                />
                {errors.customerPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerPhone.message}</p>
                )}
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Location *</label>
                  <input
                    type="text"
                    {...register('customerLocation')}
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                      errors.customerLocation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Colombo, Kandy, Galle"
                  />
                  {errors.customerLocation && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerLocation.message}</p>
                  )}
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Type</label>
                <select
                  {...register('inquiryType')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General Information</option>
                  <option value="price">Price Inquiry</option>
                  <option value="test_drive">Test Drive Request</option>
                  <option value="financing">Financing Options</option>
                  <option value="trade_in">Trade-in Evaluation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                <select
                  {...register('preferredContactMethod')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Phone Call</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message *</label>
                <textarea
                  {...register('customerMessage')}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                    errors.customerMessage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Tell us more about your requirements... (minimum 10 characters)"
                />
                {errors.customerMessage && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerMessage.message}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
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

        <div className="text-sm text-gray-600 mb-2">
          {car.year} • {car.category} • {car.fuelType}
        </div>

        <div className="text-gray-700 text-sm mb-3 line-clamp-2">
          {car.description}
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="text-center mb-3">
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(car.price)}
            </div>
            {car.tax && car.tax > 0 && (
              <div className="text-sm text-gray-600">
                Total: {formatPrice(car.price + car.tax)}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setSelectedCar(car)}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-300 text-sm font-medium"
            >
              👁️ View Details
            </button>
            <button
              onClick={() => handleInquiry(car)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300 text-sm font-medium flex items-center justify-center space-x-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Make an Inquiry</span>
            </button>
          </div>
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
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search cars by make, model, location..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isSearching && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-blue-600">
                  Searching...
                </span>
              )}
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
                    <option value="Diesel">Diesel</option>
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
            {!isLoading && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">{filteredCars.length} cars found</p>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option>Sort by: Price (Low to High)</option>
                  <option>Sort by: Price (High to Low)</option>
                  <option>Sort by: Year (Newest)</option>
                  <option>Sort by: Mileage (Lowest)</option>
                </select>
              </div>
            )}

            {isLoading ? (
              <div className={viewMode === 'grid' ?
                "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" :
                "space-y-4"
              }>
                {Array.from({ length: 6 }).map((_, index) => (
                  <CarCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedCar && (
        <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}

      {showInquiryForm && inquiryCar && (
        <InquiryFormModal
          car={inquiryCar}
          onClose={() => {
            setShowInquiryForm(false);
            setInquiryCar(null);
          }}
          onSubmit={handleInquirySubmit}
        />
      )}
    </div>
  );
};

export default CarListing;