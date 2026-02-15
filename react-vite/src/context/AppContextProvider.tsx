'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { api, authTokenUtils } from '@/lib/api';
import useToasts from '@/hooks/use-toasts';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {

  const { showErrorToast } = useToasts();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Fetch user data using the stored token
          const response = await api.get<User>('/me');
          setUser(response.data);
        }
      } catch (error) {
        showErrorToast('Failed to verify authentication. Please log in again.');
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [showErrorToast]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        // Call login endpoint
        const response = await api.post<{ token: string; user: User }>(
          '/login',
          { email, password }
        );

        // Store token in localStorage and cookies
        authTokenUtils.setToken(response.data.token);

        // Set user in state
        setUser(response.data.user);
      } catch (error) {
        showErrorToast('Login failed. Please check your credentials.');
        throw error;
      }
    },
    [showErrorToast]
  );

  const register = useCallback(
    async (name: string, email: string, password: string, password_confirmation: string) => {
      try {
        // Call register endpoint
        if (password !== password_confirmation) {
          throw new Error("Passwords do not match");
        }
        const response = await api.post<{ token: string; user: User }>(
          '/register',
          { name, email, password, password_confirmation }
        );

        // Store token in localStorage and cookies
        authTokenUtils.setToken(response.data.token);

        // Set user in state
        setUser(response.data.user);
      } catch (error) {
        showErrorToast('Registration failed. Please try again.');
        throw error;
      }
    },
    [showErrorToast]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // Call logout endpoint to invalidate token on backend
      await api.post('/logout');
    } catch (error) {
      showErrorToast('Logout failed. Please try again.');
    } finally {
      // Clear local state and tokens
      authTokenUtils.removeToken();
      setUser(null);
      setLoading(false);
    }
  }, [showErrorToast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppContextProvider');
  }
  return context;
}
