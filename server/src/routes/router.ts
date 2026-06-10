import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes.js';
import homeRoutes from './homeRoutes.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'QEye API is running 🟢', timestamp: new Date() });
});

router.use('/auth', authRoutes);
router.use('/home', homeRoutes);

export default router;