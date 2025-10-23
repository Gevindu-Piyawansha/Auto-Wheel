import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CarListing from '../CarListing';

const mockCars = [
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
    image: '/images/toyota-camry.jpg',
    features: ['Leather Seats', 'Navigation'],
    description: 'Excellent condition',
    isHotDeal: false,
    views: 15,
    rating: 5,
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 9500000,
    mileage: 15000,
    engineCC: '1500cc',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    vehicleGrade: 'EX',
    category: 'Sedan',
    location: 'Kandy',
    image: '/images/honda-civic.jpg',
    features: ['Sunroof', 'Cruise Control'],
    description: 'Like new condition',
    isHotDeal: true,
    views: 20,
    rating: 5,
  },
];

describe('CarListing Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<CarListing cars={mockCars} />);
    expect(screen.getByPlaceholderText(/search cars/i)).toBeInTheDocument();
  });

  it('displays correct number of cars', () => {
    render(<CarListing cars={mockCars} />);
    expect(screen.getByText(/2 cars found/i)).toBeInTheDocument();
  });

  it('filters cars by search term', () => {
    render(<CarListing cars={mockCars} />);
    const searchInput = screen.getByPlaceholderText(/search cars/i);
    
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    
    waitFor(() => {
      expect(screen.getByText(/1 cars found/i)).toBeInTheDocument();
    });
  });

  it('displays car make and model', () => {
    render(<CarListing cars={mockCars} />);
    expect(screen.getByText(/TOYOTA CAMRY/i)).toBeInTheDocument();
    expect(screen.getByText(/HONDA CIVIC/i)).toBeInTheDocument();
  });

  it('shows hot deal badge for hot deal cars', () => {
    render(<CarListing cars={mockCars} />);
    expect(screen.getByText(/HOT DEAL/i)).toBeInTheDocument();
  });

  it('toggles between grid and list view', () => {
    const { container } = render(<CarListing cars={mockCars} />);
    
    // Default is grid view
    expect(container.querySelector('.grid')).toBeInTheDocument();
    
    // Click list view button
    const listButton = screen.getAllByRole('button').find(
      btn => btn.querySelector('.lucide-list')
    );
    if (listButton) {
      fireEvent.click(listButton);
      waitFor(() => {
        expect(container.querySelector('.space-y-4')).toBeInTheDocument();
      });
    }
  });

  it('opens car detail modal when view details is clicked', async () => {
    render(<CarListing cars={mockCars} />);
    
    const viewDetailsButtons = screen.getAllByText(/View Details/i);
    fireEvent.click(viewDetailsButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Description/i)).toBeInTheDocument();
    });
  });

  it('shows no results message when no cars match filter', () => {
    render(<CarListing cars={mockCars} />);
    const searchInput = screen.getByPlaceholderText(/search cars/i);
    
    fireEvent.change(searchInput, { target: { value: 'NonexistentCar' } });
    
    waitFor(() => {
      expect(screen.getByText(/No cars found matching your criteria/i)).toBeInTheDocument();
    });
  });

  it('formats price correctly', () => {
    render(<CarListing cars={mockCars} />);
    expect(screen.getByText(/Rs\. 8,500,000/i)).toBeInTheDocument();
  });
});
