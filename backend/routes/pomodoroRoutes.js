import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  startSession,
  completeSession,
  abandonSession,
  getSessions,
  getTodayStats,
} from '../controllers/pomodoroController.js';

const router = express.Router();

router.post('/start', protect, startSession);
router.put('/complete/:sessionId', protect, completeSession);
router.put('/abandon/:sessionId', protect, abandonSession);
router.get('/today', protect, getTodayStats);
router.get('/', protect, getSessions);

export default router;
