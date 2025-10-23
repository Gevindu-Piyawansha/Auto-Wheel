import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import CarListing, { Car } from './components/CarListing';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import AutoWheelLogo from './components/AutoWheelLogo';
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
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <AutoWheelLogo className="h-10 w-10" />
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
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      location: 'Colombo',
      image: getCarImage('Toyota', 'Camry'),
      features: ['Leather Seats', 'Navigation', 'Backup Camera', 'Bluetooth'],
      description: 'Excellent condition Toyota Camry with low mileage and premium features.'
    },
    {
      id: 2,
      make: 'BMW',
      model: 'X5',
      year: 2021,
      price: 19500000,
      mileage: 35000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Kandy',
      image: getCarImage('BMW', 'X5'),
      features: ['All-Wheel Drive', 'Premium Sound', 'Sunroof', 'Heated Seats'],
      description: 'Luxury BMW X5 with premium features and excellent performance.'
    },
    {
      id: 3,
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 12600000,
      mileage: 8000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      location: 'Galle',
      image: getCarImage('Tesla', 'Model 3'),
      features: ['Autopilot', 'Supercharging', 'Premium Interior', 'Over-the-Air Updates'],
      description: 'Latest Tesla Model 3 with cutting-edge technology and minimal mileage.'
    },
    {
      id: 4,
      make: 'Mercedes',
      model: 'C-Class',
      year: 2023,
      price: 16200000,
      mileage: 15000,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      location: 'Negombo',
      image: getCarImage('Mercedes', 'C-Class'),
      features: ['AMG Line', 'MBUX System', 'LED Headlights', 'Wireless Charging'],
      description: 'Sophisticated Mercedes C-Class with modern luxury and efficiency.'
    },
    {
      id: 5,
      make: 'Audi',
      model: 'A4',
      year: 2022,
      price: 14250000,
      mileage: 22000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Matara',
      image: getCarImage('Audi', 'A4'),
      features: ['Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen Sound', 'Adaptive Cruise'],
      description: 'Premium Audi A4 with quattro all-wheel drive and advanced technology.'
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
