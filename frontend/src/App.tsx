import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import CarListing, { Car } from './components/CarListing';
import SuccessStories from './components/SuccessStories';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import AutoWheelLogo from './components/AutoWheelLogo';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { getCarImage } from './utils/carImages';
import { JapanFlag, SriLankaFlag } from './components/FlagIcons';
import { LogOut, User, Settings } from 'lucide-react';
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
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onViewChange('home')}
            title="Go to Home Page"
          >
            <AutoWheelLogo 
              className="h-10 w-10" 
              onClick={() => onViewChange('home')}
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                AutoWheel
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-600 whitespace-nowrap flex items-center gap-1">
                <JapanFlag className="w-3 h-3 inline-block" /> Direct Import from Japan to Sri Lanka <SriLankaFlag className="w-3 h-3 inline-block" />
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center text-xs text-gray-600 mr-4 space-x-3">
              <span>✓ Free Delivery</span>
              <span>✓ Best Prices</span>
              <span>✓ Leasing Available</span>
            </div>
            <button
              onClick={() => onViewChange('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Browse Cars
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
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
      
      console.log('Adding car:', carData);
      
      const response = await fetch(`${API_BASE_URL}/api/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Server error:', errorData);
        alert(`Failed to add car: ${errorData.error || 'Server error'}`);
        return;
      }
      
      const savedCar = await response.json();
      console.log('Car saved successfully:', savedCar);
      
      const car: Car = {
        ...savedCar,
        id: savedCar.id || savedCar._id,
        image: savedCar.image
      };
      setCars([...cars, car]);
      alert('Car added successfully!');
    } catch (error) {
      console.error('Failed to add car:', error);
      alert('Failed to add car. Please check your internet connection and try again.');
    }
  };

  const handleEditCar = async (id: number, updatedCar: Partial<Car>) => {
    try {
      console.log('Updating car:', id, updatedCar);
      
      const response = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCar)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Server error:', errorData);
        alert(`Failed to update car: ${errorData.error || 'Server error'}`);
        return;
      }
      
      setCars(cars.map(car => 
        car.id === id ? { ...car, ...updatedCar } : car
      ));
      alert('Car updated successfully!');
    } catch (error) {
      console.error('Failed to edit car:', error);
      alert('Failed to update car. Please check your internet connection and try again.');
    }
  };

  const handleDeleteCar = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }
    
    try {
      console.log('Deleting car:', id);
      
      const response = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Server error:', errorData);
        alert(`Failed to delete car: ${errorData.error || 'Server error'}`);
        return;
      }
      
      setCars(cars.filter(car => car.id !== id));
      alert('Car deleted successfully!');
    } catch (error) {
      console.error('Failed to delete car:', error);
      alert('Failed to delete car. Please check your internet connection and try again.');
    }
  };

  return (
    <div className="App flex flex-col min-h-screen">
      <SimpleNavigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />
      
      <div className="flex-grow">
        {isLoadingCars ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cars...</p>
            </div>
          </div>
        ) : currentView === 'home' ? (
          <>
            <div className="mb-0">
              <SuccessStories />
            </div>
            <div className="mt-0">
              <CarListing cars={cars} />
            </div>
          </>
        ) : (
          <AdminDashboard
            cars={cars}
            onAddCar={handleAddCar}
            onEditCar={handleEditCar}
            onDeleteCar={handleDeleteCar}
          />
        )}
      </div>

      <Footer 
        onLoginClick={() => setIsLoginModalOpen(true)}
        isAdminLoggedIn={!!(user && isAdmin())}
        onAdminPanelClick={() => setCurrentView('admin')}
        onLogoutClick={() => {
          logout();
          setCurrentView('home');
        }}
      />

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
