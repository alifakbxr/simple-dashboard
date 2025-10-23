'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in on mount (client-side only)
    const checkAuth = async () => {
      try {
        // Add a small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 100));
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Add token refresh functionality
  useEffect(() => {
    if (!user) return;

    const refreshToken = async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          // Token refreshed successfully, continue with current user
        } else {
          // Refresh failed, user needs to login again
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };

    // Set up periodic token refresh (every 50 minutes)
    const refreshInterval = setInterval(refreshToken, 50 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [user]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, login: () => {}, logout: () => {}, isLoading: true }}>
        {children}
      </AuthContext.Provider>
    );
  }

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}