
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBVBJxtTzcJrbiJwJfFAg_hxgz2p2fnF74",
  authDomain: "qeye-f89a6.firebaseapp.com",
  projectId: "qeye-f89a6",
  storageBucket: "qeye-f89a6.firebasestorage.app",
  messagingSenderId: "515565544862",
  appId: "1:515565544862:web:95032a08e77bce10f0a28f"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const firebaseAuth = getAuth(app);
export default app;