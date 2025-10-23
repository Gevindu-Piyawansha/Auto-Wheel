import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import CarListing, { Car } from './components/CarListing';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import AutoWheelLogo from './components/AutoWheelLogo';
import ErrorBoundary from './components/ErrorBoundary';
import { getCarImage } from './utils/carImages';
import { LogIn, LogOut, User, Settings } from 'lucide-react';
import './App.css';

// Navigation Component
const SimpleNavigation: React.FC<{
  currentView: 'home' | 'admin';
  onViewChange: (view: 'home' | 'admin') => void;
  onLoginClick: () => void;
}> = ({ currentView, onViewChange, onLoginClick }) => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    onViewChange('home');
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm">
        🇯🇵 Direct Import from Japan to Sri Lanka 🇱🇰 | Free Delivery | Best Prices | Leasing Available
      </div>
      
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onViewChange('home')}
            title="Go to Home Page"
          >
            <AutoWheelLogo 
              className="h-10 w-10" 
              onClick={() => onViewChange('home')}
            />
            <span className="text-xl font-bold text-gray-900">Auto-Wheel</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onViewChange('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Browse Cars
            </button>
            
            {user && isAdmin() ? (
              <>
                <button
                  onClick={() => onViewChange('admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    currentView === 'admin' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Admin Panel
                </button>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Admin</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  // Redirect from admin if not authenticated
  React.useEffect(() => {
    if (currentView === 'admin' && (!user || !isAdmin())) {
      setCurrentView('home');
    }
  }, [currentView, user, isAdmin]);
  const [cars, setCars] = useState<Car[]>([
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 8500000,
      mileage: 25000,
      engineCC: '2000cc',
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      vehicleGrade: 'G',
      category: 'Sedan',
      location: 'Colombo',
      image: getCarImage('Toyota', 'Camry'),
      features: ['Leather Seats', 'Navigation', 'Backup Camera', 'Bluetooth'],
      description: 'Excellent condition Toyota Camry with low mileage and premium features.',
      isHotDeal: false,
      views: 15,
      rating: 5
    },
    {
      id: 2,
      make: 'Suzuki',
      model: 'Alto',
      year: 2025,
      price: 6800000,
      mileage: 2000,
      engineCC: '660cc',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      vehicleGrade: 'L',
      category: 'Hatchback',
      location: 'Colombo',
      image: getCarImage('Suzuki', 'Alto'),
      features: ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags'],
      description: 'SUZUKI ALTO MODEL CODE- HA37S GRADE- L YEAR - 2025 Manufacture 2025 ODOMETER - 2000 KM ENGINE CC- 660 TRANSMISSION - FAT COLOR - LIGHT BLUE FUEL -PETROL',
      isHotDeal: true,
      views: 11,
      rating: 3
    },
    {
      id: 3,
      make: 'Honda',
      model: 'Vezel',
      year: 2024,
      price: 16700000,
      mileage: 5000,
      engineCC: '1500cc',
      fuelType: 'Hybrid',
      transmission: 'CVT',
      vehicleGrade: 'G',
      category: 'SUV',
      location: 'Kandy',
      image: getCarImage('Honda', 'Vezel'),
      features: ['Honda Sensing', 'LED Headlights', 'Touchscreen', 'Backup Camera'],
      description: 'Premium Honda Vezel with hybrid technology and modern features directly imported from Japan.',
      isHotDeal: true,
      views: 8,
      rating: 5
    },
    {
      id: 4,
      make: 'Toyota',
      model: 'Raize',
      year: 2024,
      price: 12000000,
      mileage: 3000,
      engineCC: '1000cc',
      fuelType: 'Petrol',
      transmission: 'CVT',
      vehicleGrade: 'G',
      category: 'SUV',
      location: 'Galle',
      image: getCarImage('Toyota', 'Raize'),
      features: ['Smart Assist', 'Keyless Entry', 'Push Start', 'Climate Control'],
      description: 'Compact SUV Toyota Raize with excellent fuel efficiency and modern safety features.',
      isHotDeal: false,
      views: 12,
      rating: 4
    },
    {
      id: 5,
      make: 'Nissan',
      model: 'Aura',
      year: 2024,
      price: 14000000,
      mileage: 4500,
      engineCC: '1200cc',
      fuelType: 'Petrol',
      transmission: 'CVT',
      vehicleGrade: 'X',
      category: 'Hatchback',
      location: 'Negombo',
      image: getCarImage('Nissan', 'Aura'),
      features: ['Intelligent Key', 'Around View Monitor', 'Nissan Connect', 'LED Lights'],
      description: 'Modern Nissan Aura with advanced technology and premium interior features.',
      isHotDeal: true,
      views: 6,
      rating: 4
    }
  ]);

  const handleAddCar = (newCar: Omit<Car, 'id'>) => {
    const car: Car = {
      ...newCar,
      id: Math.max(...cars.map(c => c.id)) + 1,
      image: newCar.image || getCarImage(newCar.make, newCar.model)
    };
    setCars([...cars, car]);
  };

  const handleEditCar = (id: number, updatedCar: Partial<Car>) => {
    setCars(cars.map(car => 
      car.id === id ? { ...car, ...updatedCar } : car
    ));
  };

  const handleDeleteCar = (id: number) => {
    setCars(cars.filter(car => car.id !== id));
  };

  return (
    <div className="App">
      <SimpleNavigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />
      
      {currentView === 'home' ? (
        <CarListing cars={cars} />
      ) : (
        <AdminDashboard
          cars={cars}
          onAddCar={handleAddCar}
          onEditCar={handleEditCar}
          onDeleteCar={handleDeleteCar}
        />
      )}

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
