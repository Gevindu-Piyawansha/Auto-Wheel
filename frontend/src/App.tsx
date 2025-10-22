import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import CarListing, { Car } from './components/CarListing';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import { getCarImage } from './utils/carImages';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 285000,
      mileage: 25000,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      location: 'Oslo',
      image: getCarImage('Toyota', 'Camry'),
      features: ['Leather Seats', 'Navigation', 'Backup Camera', 'Bluetooth'],
      description: 'Excellent condition Toyota Camry with low mileage and premium features.'
    },
    {
      id: 2,
      make: 'BMW',
      model: 'X5',
      year: 2021,
      price: 650000,
      mileage: 35000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Bergen',
      image: getCarImage('BMW', 'X5'),
      features: ['All-Wheel Drive', 'Premium Sound', 'Sunroof', 'Heated Seats'],
      description: 'Luxury BMW X5 with premium features and excellent performance.'
    },
    {
      id: 3,
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 420000,
      mileage: 8000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      location: 'Stavanger',
      image: getCarImage('Tesla', 'Model 3'),
      features: ['Autopilot', 'Supercharging', 'Premium Interior', 'Over-the-Air Updates'],
      description: 'Latest Tesla Model 3 with cutting-edge technology and minimal mileage.'
    },
    {
      id: 4,
      make: 'Mercedes',
      model: 'C-Class',
      year: 2023,
      price: 540000,
      mileage: 15000,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      location: 'Trondheim',
      image: getCarImage('Mercedes', 'C-Class'),
      features: ['AMG Line', 'MBUX System', 'LED Headlights', 'Wireless Charging'],
      description: 'Sophisticated Mercedes C-Class with modern luxury and efficiency.'
    },
    {
      id: 5,
      make: 'Audi',
      model: 'A4',
      year: 2022,
      price: 475000,
      mileage: 22000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      location: 'Kristiansand',
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
    <AuthProvider>
      <div className="App">
        {/* Simple Navigation Header */}
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900">🚗 Auto-Wheel</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Browse Cars
                </button>
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'admin' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Admin Panel
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </nav>
        
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
    </AuthProvider>
  );
}

export default App;
