import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  plan: 'free' | 'premium';
  subscription: {
    status: string;
    endDate: string;
  } | null;
  hasApiKey?: boolean;
  uploadStats?: {
    used: number;
    total: number;
    remaining: number;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if token exists and is valid
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set default auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Check token expiration
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp && decoded.exp < currentTime) {
            throw new Error('Token expired');
          }
          
          // Get user data
          await refreshUser();
        } catch (error) {
          console.error('Authentication error:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/api/auth/user');
      setUser(data.user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      
      // Save token
      localStorage.setItem('token', data.token);
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Set user data
      setUser(data.user);
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Login failed';
        toast.error(message);
      }
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const { data } = await api.post('/api/auth/register', { username, email, password });
      
      // Save token
      localStorage.setItem('token', data.token);
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Set user data
      setUser(data.user);
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Registration failed';
        toast.error(message);
      }
      throw error;
    }
  };

  const logout = () => {
    // Remove token
    localStorage.removeItem('token');
    
    // Remove auth header
    delete api.defaults.headers.common['Authorization'];
    
    // Clear user data
    setUser(null);
    
    navigate('/login');
  };

  const isPremium = 
    user?.plan === 'premium' && 
    user?.subscription?.status === 'active';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isPremium,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};