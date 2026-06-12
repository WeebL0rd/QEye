import { getFirestore, getAuth } from '../config/firebase.js';

const UserDAO = {
  async createUser(email, password, displayName) {
    const auth = getAuth();
    const db = getFirestore();

    // Crea el usuario en Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    // Guarda el perfil en Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName,
      createdAt: new Date().toISOString(),
    });

    return {
      id: userRecord.uid,
      email,
      displayName,
    };
  },

  async getUserByEmail(email) {
    const auth = getAuth();
    const userRecord = await auth.getUserByEmail(email);
    return userRecord;
  },

  async getProfile(uid) {
    const db = getFirestore();
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return null;
    return doc.data();
  },
};

export default UserDAO;