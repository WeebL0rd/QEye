import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService, { UserProfile } from '../services/authService';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const restore = async () => {
      try {
        const token = await AsyncStorage.getItem('qeye_token');
        if (token) {
          const user = await AuthService.getProfile();
          setState({ user, token, isLoading: false, isAuthenticated: true });
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      } catch {
        await AsyncStorage.removeItem('qeye_token');
        setState((s) => ({ ...s, isLoading: false }));
      }
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await AuthService.loginWithEmail(email, password);
    setState({ user: result.user, token: result.token, isLoading: false, isAuthenticated: true });
  };

  const register = async (email: string, password: string, displayName: string) => {
    const result = await AuthService.register(email, password, displayName);
    setState({ user: result.user, token: result.token, isLoading: false, isAuthenticated: true });
  };

  const logout = async () => {
    await AuthService.logout();
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};