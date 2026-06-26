import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  createExam,
  updateExam,
  createNotice,
  broadcastAnnouncement,
  getStats,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.post('/exams', createExam);
router.put('/exams/:examId', updateExam);
router.post('/notices', createNotice);
router.post('/announcements', broadcastAnnouncement);

export default router;
