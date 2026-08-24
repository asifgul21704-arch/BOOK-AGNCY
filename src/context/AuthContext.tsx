import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, isAdminLogin?: boolean) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  saveAddress: (address: Omit<Address, 'id'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('haqanya_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize or fetch current user on load
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('haqanya_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
          setToken(storedToken);
        } else {
          localStorage.removeItem('haqanya_token');
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to load session user', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password = 'password123', isAdminLogin = false) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isAdminLogin })
      });
      const data = await res.json();

      if (data.success && data.data) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem('haqanya_token', data.data.token);
        return { success: true, message: data.message || 'Login successful!' };
      } else {
        return { success: false, message: data.message || 'Invalid credentials.' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during login.' };
    }
  };

  const register = async (name: string, email: string, phone: string, password = 'password123') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();

      if (data.success && data.data) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem('haqanya_token', data.data.token);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Registration failed.' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during registration.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('haqanya_token');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success && resData.data) {
        setUser(resData.data);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const saveAddress = async (address: Omit<Address, 'id'>) => {
    if (!user) return false;
    const currentAddresses = user.addresses || [];
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };
    const updated = [...currentAddresses, newAddress];
    return await updateProfile({ addresses: updated });
  };

  const isAdmin = user?.role === 'Super Admin' || user?.role === 'Store Admin';
  const isManager = user?.role === 'Manager' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin,
        isManager,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        saveAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
