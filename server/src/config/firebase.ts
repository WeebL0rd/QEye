import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import config from './environment';

const initializeFirebase = (): void => {
  if (admin.apps.length > 0) return;

  let credential: admin.credential.Credential;

  if (config.firebase.serviceAccountPath && existsSync(config.firebase.serviceAccountPath)) {
    const raw = readFileSync(config.firebase.serviceAccountPath, 'utf-8');
    const serviceAccount = JSON.parse(raw) as admin.ServiceAccount;
    credential = admin.credential.cert(serviceAccount);
  } else if (
    config.firebase.projectId &&
    config.firebase.clientEmail &&
    config.firebase.privateKey
  ) {
    credential = admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.clientEmail,
      privateKey: config.firebase.privateKey,
    });
  } else {
    throw new Error(
      'Firebase credentials not configured. ' +
      'Set FIREBASE_SERVICE_ACCOUNT_PATH or ' +
      'FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in .env',
    );
  }

  admin.initializeApp({ credential });
  console.log('✅ Firebase Admin initialized');
};

export const getFirestore = (): FirebaseFirestore.Firestore => admin.firestore();
export const getAuth = (): admin.auth.Auth => admin.auth();
export { admin };
export default initializeFirebase;