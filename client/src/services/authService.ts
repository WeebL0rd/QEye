import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseAuth } from '../config/firebase';
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

const AuthService = {
  async register(email: string, password: string, displayName: string): Promise<AuthResult> {
    const { data } = await api.post<{ success: boolean; data: AuthResult }>(
      '/auth/register',
      { email, password, displayName },
    );
    await AsyncStorage.setItem('qeye_token', data.data.token);
    return data.data;
  },

  async loginWithEmail(email: string, password: string): Promise<AuthResult> {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return AuthService.exchangeToken(idToken);
  },

  async exchangeToken(firebaseIdToken: string): Promise<AuthResult> {
    const { data } = await api.post<{ success: boolean; data: AuthResult }>(
      '/auth/login',
      {},
      { headers: { Authorization: `Bearer ${firebaseIdToken}` } },
    );
    await AsyncStorage.setItem('qeye_token', data.data.token);
    return data.data;
  },

  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get<{ success: boolean; data: UserProfile }>('/auth/me');
    return data.data;
  },

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
    await AsyncStorage.removeItem('qeye_token');
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('qeye_token');
  },
};

export default AuthService;