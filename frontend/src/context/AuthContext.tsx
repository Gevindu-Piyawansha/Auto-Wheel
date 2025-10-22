import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock admin credentials - in real app, this would be API call
  const mockAdmin = {
    email: 'admin@auto-wheel.com',
    password: 'admin123',
    user: {
      id: 1,
      name: 'Auto-Wheel Admin',
      email: 'admin@auto-wheel.com',
      role: 'admin' as const
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === mockAdmin.email && password === mockAdmin.password) {
      setUser(mockAdmin.user);
      localStorage.setItem('auto-wheel-user', JSON.stringify(mockAdmin.user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auto-wheel-user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('auto-wheel-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('auto-wheel-user');
      }
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;