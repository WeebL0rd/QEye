import admin from 'firebase-admin';
import { getFirestore } from '../config/firebase.js';
import type { Questionnaire, CreateQuestionnaireDTO, UpdateQuestionnaireDTO } from '../types/index.js';

const COLLECTION = 'questionnaires';
const ts = () => admin.firestore.FieldValue.serverTimestamp();

const QuestionnaireDAO = {
  async findAllByOwner(ownerId: string): Promise<Questionnaire[]> {
    const snap = await getFirestore()
      .collection(COLLECTION)
      .where('ownerId', '==', ownerId)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Questionnaire, 'id'>),
    }));
  },

  async findById(id: string): Promise<Questionnaire | null> {
    const doc = await getFirestore().collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...(doc.data() as Omit<Questionnaire, 'id'>) };
  },

  async isOwner(id: string, ownerId: string): Promise<boolean> {
    const doc = await getFirestore().collection(COLLECTION).doc(id).get();
    if (!doc.exists) return false;
    return (doc.data() as Questionnaire).ownerId === ownerId;
  },

  async create(ownerId: string, dto: CreateQuestionnaireDTO): Promise<Questionnaire> {
    const db = getFirestore();
    const ref = db.collection(COLLECTION).doc();
    await ref.set({
      ownerId,
      title: dto.title,
      description: dto.description ?? '',
      questions: dto.questions ?? [],
      isPublished: false,
      responseCount: 0,
      createdAt: ts(),
      updatedAt: ts(),
    });
    const created = await ref.get();
    return { id: created.id, ...(created.data() as Omit<Questionnaire, 'id'>) };
  },

  async update(id: string, dto: UpdateQuestionnaireDTO): Promise<Questionnaire | null> {
    const db = getFirestore();
    const ref = db.collection(COLLECTION).doc(id);
    const updates: Record<string, unknown> = { updatedAt: ts() };
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.questions !== undefined) updates.questions = dto.questions;
    if (dto.isPublished !== undefined) updates.isPublished = dto.isPublished;
    await ref.update(updates);
    const updated = await ref.get();
    if (!updated.exists) return null;
    return { id: updated.id, ...(updated.data() as Omit<Questionnaire, 'id'>) };
  },

  async delete(id: string): Promise<void> {
    const db = getFirestore();
    const batch = db.batch();
    batch.delete(db.collection(COLLECTION).doc(id));
    // Las responses las elimina quien sea dueño del dashboard
    await batch.commit();
  },

  async incrementResponseCount(id: string): Promise<void> {
    await getFirestore()
      .collection(COLLECTION)
      .doc(id)
      .update({
        responseCount: admin.firestore.FieldValue.increment(1),
        updatedAt: ts(),
      });
  },
};

export default QuestionnaireDAO;