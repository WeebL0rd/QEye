import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface AuthResult {
  token: string;
  user: UserProfile;
}

// Forma real de la respuesta del servidor
interface AuthResponse {
  success: boolean;
  token: string;
  user: UserProfile;
}

const AuthService = {
  async register(email: string, password: string, displayName: string): Promise<AuthResult> {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, password, displayName });
    await AsyncStorage.setItem('qeye_token', data.token);
    return { token: data.token, user: data.user };
  },

  async loginWithEmail(email: string, password: string): Promise<AuthResult> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    await AsyncStorage.setItem('qeye_token', data.token);
    return { token: data.token, user: data.user };
  },

  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get<{ success: boolean; user: UserProfile }>('/auth/profile');
    return data.user;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('qeye_token');
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('qeye_token');
  },
};

export default AuthService;