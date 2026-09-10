'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, UserRole } from '@/types/auth';
import { authApi, LoginPayload, RegisterPayload } from '@/lib/api/auth';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  login: (credentials: LoginPayload) => Promise<User>;
  register: (data: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      const storedToken = localStorage.getItem('campusverse_token');
      if (!storedToken) {
        setStatus('unauthenticated');
        setUser(null);
        setToken(null);
        return null;
      }
      setToken(storedToken);
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      setStatus('authenticated');
      return currentUser;
    } catch {
      localStorage.removeItem('campusverse_token');
      setUser(null);
      setToken(null);
      setStatus('unauthenticated');
      return null;
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (credentials: LoginPayload): Promise<User> => {
    setStatus('loading');
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('campusverse_token', response.token);
      setToken(response.token);
      setUser(response.user);
      setStatus('authenticated');
      return response.user;
    } catch (err) {
      setStatus('unauthenticated');
      throw err;
    }
  };

  const register = async (data: RegisterPayload): Promise<User> => {
    setStatus('loading');
    try {
      const response = await authApi.register(data);
      localStorage.setItem('campusverse_token', response.token);
      setToken(response.token);
      setUser(response.user);
      setStatus('authenticated');
      return response.user;
    } catch (err) {
      setStatus('unauthenticated');
      throw err;
    }
  };

  const logout = async () => {
    setStatus('loading');
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('campusverse_token');
      setUser(null);
      setToken(null);
      setStatus('unauthenticated');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        status,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
