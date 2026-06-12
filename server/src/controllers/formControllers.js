import DocumentDAO from '../dao/documentDAO.js';

export const saveDocument = async (req, res) => {
    try {
        const { projectName, createdAt, scores } = req.body;
        const userId = req.user?.uid;

        if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
        }

        if (!projectName || !scores || !Array.isArray(scores)) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos requeridos: projectName y scores.',
        });
        }

        const documentData = {
        userId,
        projectName,
        createdAt: createdAt ?? new Date().toISOString(),
        scores,
        };

        const savedDocument = await DocumentDAO.createDocument(documentData);

        return res.status(201).json({
        success: true,
        message: 'Documento creado exitosamente.',
        document: savedDocument,
        });
    } catch (error) {
        console.error('Error al crear documento:', error);
        return res.status(500).json({
        success: false,
        message: 'Error interno al crear el documento.',
        });
    }
};

export const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { projectName, createdAt, scores } = req.body;
        const userId = req.user?.uid;

        if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
        }

        if (!id || id === 'Pending') {
        return res.status(400).json({ success: false, message: 'ID de documento inválido.' });
        }

        if (!projectName || !scores || !Array.isArray(scores)) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos requeridos: projectName y scores.',
        });
        }

        const documentData = {
        userId,
        projectName,
        createdAt: createdAt ?? new Date().toISOString(),
        scores,
        };

        const updatedDocument = await DocumentDAO.updateDocument(id, documentData);

        return res.status(200).json({
        success: true,
        message: 'Documento actualizado exitosamente.',
        document: updatedDocument,
        });
    } catch (error) {
        console.error('Error al actualizar documento:', error);

        if (error.message?.includes('no encontrado')) {
        return res.status(404).json({ success: false, message: error.message });
        }

        return res.status(500).json({
        success: false,
        message: 'Error interno al actualizar el documento.',
        });
    }
};


export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.uid;

        if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
        }

        await DocumentDAO.deleteDocument(id, userId);

        return res.status(200).json({
        success: true,
        message: 'Documento eliminado exitosamente.',
        });
    } catch (error) {
        console.error('Error al eliminar documento:', error);

        if (error.message?.includes('no encontrado') || error.message?.includes('no autorizado')) {
        return res.status(404).json({ success: false, message: error.message });
        }

        return res.status(500).json({
        success: false,
        message: 'Error interno al eliminar el documento.',
        });
    }
};