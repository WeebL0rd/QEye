import { Router } from 'express';
import { login, register, getMe } from '../controllers/authController.js';
import { verifyFirebaseToken, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', verifyFirebaseToken, login);
router.post('/register', register);
router.get('/me', verifyToken, getMe);

export default router;