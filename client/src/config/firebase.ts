import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBVBJxtTzcJrbiJwJfFAg_hxgz2p2fnF74",
  authDomain: "qeye-f89a6.firebaseapp.com",
  projectId: "qeye-f89a6",
  storageBucket: "qeye-f89a6.firebasestorage.app",
  messagingSenderId: "515565544862",
  appId: "1:515565544862:web:95032a08e77bce10f0a28f"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Solo inicializa Auth una vez
let firebaseAuth;
try {
  firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch {
  // Ya fue inicializado, obtener la instancia existente
  firebaseAuth = getAuth(app);
}

export { firebaseAuth };
export default app;