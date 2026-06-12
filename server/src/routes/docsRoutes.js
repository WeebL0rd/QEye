import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { saveDocument, updateDocument } from '../controllers/formControllers.js';

const router = express.Router();

router.post('/save', verifyToken, saveDocument);

router.put('/update/:id', verifyToken, updateDocument);

router.get('/ping', (req, res) => {
  res.json({ success: true, message: 'docs route ok' });
});

export default router;