import React from 'react';
import { Settings, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AutoWheelLogo from './AutoWheelLogo';

// Updated UI optimizations

interface NavigationProps {
  currentView: 'home' | 'admin';
  onViewChange: (view: 'home' | 'admin') => void;
  onLoginClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  onLoginClick
}) => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    onViewChange('home');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onViewChange('home')}
              title="Go to Home Page"
            >
              <AutoWheelLogo 
                className="h-6 w-6 sm:h-8 sm:w-8" 
                onClick={() => onViewChange('home')}
              />
              <span className="text-base sm:text-xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                AutoWheel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => onViewChange('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'home'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Browse Cars
              </button>
              
              {user && isAdmin() && (
                <button
                  onClick={() => onViewChange('admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                    currentView === 'admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Admin Panel
                </button>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <span className="hidden sm:inline text-sm text-gray-700 font-medium">
                    {user.name}
                  </span>
                  {user.role === 'admin' && (
                    <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded transition-colors whitespace-nowrap"
              >
                <LogIn className="w-3 h-3 mr-1" />
                Admin
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;