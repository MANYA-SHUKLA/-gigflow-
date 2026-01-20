'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.check();
      setUser(response.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.data.data);
      router.push('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ name, email, password });
      setUser(response.data.data);
      router.push('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      router.push('/login');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Logout failed');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};