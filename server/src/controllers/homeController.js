import DocumentDAO from '../dao/documentDAO.js';

export const getUserDocuments = async (req, res) => {
    try {
        const userId = req.user?.uid;

        if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
        }
        const documents = await DocumentDAO.getDocumentsByUser(userId);
        return res.status(200).json({
        success: true,
        documents,
        });
    } catch (error) {
        console.error('Error al obtener documentos:', error);
        return res.status(500).json({
        success: false,
        message: 'Error interno al obtener los documentos.',
        });
    }
};