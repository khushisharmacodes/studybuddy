import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getNotices } from '../controllers/noticeController.js';

const router = express.Router();

router.get('/', protect, getNotices);

export default router;
