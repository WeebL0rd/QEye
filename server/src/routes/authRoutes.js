import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.get('/ping', (req, res) => res.json({ success: true, message: 'auth route ok' }));

export default router;