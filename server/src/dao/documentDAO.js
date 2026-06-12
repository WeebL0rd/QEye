import { getFirestore } from '../config/firebase.js';

const DocumentDAO = {
    async createDocument(documentData) {
        const db = getFirestore();

        const docRef = db.collection('documents').doc();

        const document = {
        ...documentData,
        id: docRef.id,
        updatedAt: new Date().toISOString(),
        };

        await docRef.set(document);

        return document;
    },

    async updateDocument(documentId, documentData) {
        const db = getFirestore();

        const docRef = db.collection('documents').doc(documentId);
        const existing = await docRef.get();

        if (!existing.exists) {
        throw new Error(`Documento con id ${documentId} no encontrado.`);
        }

        const updated = {
        ...documentData,
        id: documentId,
        updatedAt: new Date().toISOString(),
        };

        await docRef.set(updated, { merge: true });

        return updated;
    },

    async getDocumentById(documentId) {
        const db = getFirestore();
        const doc = await db.collection('documents').doc(documentId).get();
        if (!doc.exists) return null;
        return doc.data();
    },

    async getDocumentsByUser(userId) {
        const db = getFirestore();
        const snapshot = await db
        .collection('documents')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

        return snapshot.docs.map(doc => doc.data());
    },
};

export default DocumentDAO;