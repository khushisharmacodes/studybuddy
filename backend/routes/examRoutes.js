import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getExams, getExamStatus } from '../controllers/examController.js';

const router = express.Router();

router.get('/', protect, getExams);
router.get('/status', protect, getExamStatus);

export default router;
