import admin from 'firebase-admin';
import { getFirestore } from '../config/firebase.js';
import type { User, CreateUserDTO } from '../types/index.js';

const COLLECTION = 'users';
const ts = () => admin.firestore.FieldValue.serverTimestamp();

const UserDAO = {
  async findById(uid: string): Promise<User | null> {
    const doc = await getFirestore().collection(COLLECTION).doc(uid).get();
    if (!doc.exists) return null;
    return { uid: doc.id, ...(doc.data() as Omit<User, 'uid'>) };
  },

  async findByEmail(email: string): Promise<User | null> {
    const snap = await getFirestore()
      .collection(COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { uid: doc.id, ...(doc.data() as Omit<User, 'uid'>) };
  },

  async create(dto: CreateUserDTO): Promise<User> {
    const db = getFirestore();
    const userData = {
      email: dto.email,
      displayName: dto.displayName,
      photoURL: dto.photoURL ?? null,
      createdAt: ts(),
      updatedAt: ts(),
    };
    await db.collection(COLLECTION).doc(dto.uid).set(userData);
    const created = await db.collection(COLLECTION).doc(dto.uid).get();
    return { uid: created.id, ...(created.data() as Omit<User, 'uid'>) };
  },

  async update(
    uid: string,
    fields: Partial<Pick<User, 'displayName' | 'photoURL'>>,
  ): Promise<User | null> {
    const db = getFirestore();
    const ref = db.collection(COLLECTION).doc(uid);
    await ref.update({ ...fields, updatedAt: ts() });
    const updated = await ref.get();
    if (!updated.exists) return null;
    return { uid: updated.id, ...(updated.data() as Omit<User, 'uid'>) };
  },

  async delete(uid: string): Promise<void> {
    await getFirestore().collection(COLLECTION).doc(uid).delete();
  },
};

export default UserDAO;