import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { saveDocument, updateDocument, deleteDocument } from '../controllers/formControllers.js';
import { getUserDocuments } from '../controllers/homeController.js';

const router = express.Router();

router.get('/', verifyToken, getUserDocuments);
router.post('/save', verifyToken, saveDocument);
router.put('/update/:id', verifyToken, updateDocument);
router.delete('/delete/:id', verifyToken, deleteDocument);

router.get('/ping', (req, res) => {
  res.json({ success: true, message: 'docs route ok' });
});

export default router;