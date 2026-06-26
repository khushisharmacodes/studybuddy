import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMarks, createMark, getWeakSubjects } from '../controllers/markController.js';

const router = express.Router();

router.get('/', protect, getMarks);
router.post('/', protect, createMark);
router.get('/weak-subjects', protect, getWeakSubjects);

export default router;
