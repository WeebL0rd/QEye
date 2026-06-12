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
        return await this.createDocument(documentData);
        }

        const updated = {
        ...documentData,
        id: documentId,
        updatedAt: new Date().toISOString(),
        };
        await docRef.set(updated, { merge: true });
        return updated;
    },

    async deleteDocument(documentId, userId) {
        const db = getFirestore();
        const docRef = db.collection('documents').doc(documentId);
        const existing = await docRef.get();

        if (!existing.exists) {
        throw new Error(`Documento con id ${documentId} no encontrado.`);
        }

        // Verificar que el documento pertenece al usuario que lo quiere eliminar
        if (existing.data().userId !== userId) {
        throw new Error('No autorizado para eliminar este documento.');
        }

        await docRef.delete();
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
        .get();

        return snapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
};

export default DocumentDAO;