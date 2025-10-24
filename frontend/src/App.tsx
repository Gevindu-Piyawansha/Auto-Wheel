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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [isLoadingCars, setIsLoadingCars] = useState(true);

  // Redirect from admin if not authenticated
  React.useEffect(() => {
    if (currentView === 'admin' && (!user || !isAdmin())) {
      setCurrentView('home');
    }
  }, [currentView, user, isAdmin]);

  const [cars, setCars] = useState<Car[]>([]);

  // Fetch cars from API on component mount
  React.useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoadingCars(true);
        const response = await fetch(`${API_BASE_URL}/api/cars`);
        if (response.ok) {
          const data = await response.json();
          // Map MongoDB _id to id for frontend compatibility
          const mappedCars = data.map((car: any) => ({
            ...car,
            id: car._id || car.id,
            // Only use fallback image if no image is provided at all
            image: car.image && car.image.trim() !== '' ? car.image : getCarImage(car.make, car.model)
          }));
          setCars(mappedCars);
        }
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setIsLoadingCars(false);
      }
    };
    fetchCars();
  }, []);

  const handleAddCar = async (newCar: Omit<Car, 'id'>) => {
    try {
      const carData = {
        ...newCar,
        // Only use fallback image if no image URL provided
        image: newCar.image && newCar.image.trim() !== '' ? newCar.image : getCarImage(newCar.make, newCar.model)
      };
      
      const response = await fetch(`${API_BASE_URL}/api/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
      });
      
      if (response.ok) {
        const savedCar = await response.json();
        const car: Car = {
          ...savedCar,
          id: savedCar.id || savedCar._id,
          image: savedCar.image
        };
        setCars([...cars, car]);
      }
    } catch (error) {
      console.error('Failed to add car:', error);
      alert('Failed to add car. Please try again.');
    }
  };

  const handleEditCar = async (id: number, updatedCar: Partial<Car>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCar)
      });
      
      if (response.ok) {
        setCars(cars.map(car => 
          car.id === id ? { ...car, ...updatedCar } : car
        ));
      }
    } catch (error) {
      console.error('Failed to edit car:', error);
      alert('Failed to update car. Please try again.');
    }
  };

  const handleDeleteCar = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok || response.status === 204) {
        setCars(cars.filter(car => car.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete car:', error);
      alert('Failed to delete car. Please try again.');
    }
  };

  return (
    <div className="App">
      <SimpleNavigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />
      
      {isLoadingCars ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cars...</p>
          </div>
        </div>
      ) : currentView === 'home' ? (
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
