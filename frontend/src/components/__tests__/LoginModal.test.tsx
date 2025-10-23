import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginModal from '../LoginModal';

describe('LoginModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('does not render when isOpen is false', () => {
    render(
      <AuthProvider>
        <LoginModal isOpen={false} onClose={mockOnClose} />
      </AuthProvider>
    );
    
    expect(screen.queryByText(/Admin Login/i)).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={mockOnClose} />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
  });

  it('displays email and password fields', () => {
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={mockOnClose} />
      </AuthProvider>
    );
    
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={mockOnClose} />
      </AuthProvider>
    );
    
    const closeButton = screen.getAllByRole('button')[0]; // First button is close (X)
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('allows typing in email field', () => {
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={mockOnClose} />
      </AuthProvider>
    );
    
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'admin@autowheel.lk' } });
    
    expect(emailInput.value).toBe('admin@autowheel.lk');
  });

  it('allows typing in password field', () => {
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={mockOnClose} />
      </AuthProvider>
    );
    
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput.value).toBe('password123');
  });

  it('has a login submit button', () => {
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={mockOnClose} />
      </AuthProvider>
    );
    
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('password field is of type password', () => {
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={mockOnClose} />
      </AuthProvider>
    );
    
    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
