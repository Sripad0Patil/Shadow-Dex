'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { loginApi, signupApi, getMeApi } from '@/src/api/auth';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  highestQuickPlayScore?: number;
  totalQuickPlayGames?: number;
  totalQuickPlayWins?: number;
  highestDailyScore?: number;
  totalDailyGames?: number;
  totalDailyWins?: number;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMeApi();
      if (res.success && res.user) {
        setUser({
          id: res.user._id || res.user.id,
          username: res.user.username,
          email: res.user.email,
          highestQuickPlayScore: res.user.highestQuickPlayScore,
          totalQuickPlayGames: res.user.totalQuickPlayGames,
          totalQuickPlayWins: res.user.totalQuickPlayWins,
          highestDailyScore: res.user.highestDailyScore,
          totalDailyGames: res.user.totalDailyGames,
          totalDailyWins: res.user.totalDailyWins,
          createdAt: res.user.createdAt,
        });
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to retrieve user session:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Check for JWT token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // When token state updates, fetch current user info
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token, fetchCurrentUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await loginApi(email, password);
      if (res.success && res.token && res.user) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser({
          id: res.user.id,
          username: res.user.username,
          email: res.user.email,
        });
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: res.message || 'Login failed' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      return { success: false, error: msg };
    }
  }, []);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    try {
      const res = await signupApi(username, email, password);
      if (res.success && res.token && res.user) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser({
          id: res.user.id,
          username: res.user.username,
          email: res.user.email,
        });
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: res.message || 'Signup failed' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Signup failed';
      return { success: false, error: msg };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    await fetchCurrentUser();
  }, [token, fetchCurrentUser]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthModalOpen,
        login,
        signup,
        logout,
        refreshUser,
        openAuthModal,
        closeAuthModal,
      }}
    >
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
