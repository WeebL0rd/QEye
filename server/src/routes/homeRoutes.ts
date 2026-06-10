import { Router } from 'express';
import {
  getMyQuestionnaires,
  getQuestionnaireById,
  createQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
} from '../controllers/homeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.get('/questionnaires', getMyQuestionnaires);
router.get('/questionnaires/:id', getQuestionnaireById);
router.post('/questionnaires', createQuestionnaire);
router.put('/questionnaires/:id', updateQuestionnaire);
router.delete('/questionnaires/:id', deleteQuestionnaire);

export default router;