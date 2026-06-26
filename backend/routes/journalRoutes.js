import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getJournals, createJournal, updateJournal, deleteJournal } from '../controllers/journalController.js';

const router = express.Router();

router.get('/', protect, getJournals);
router.post('/', protect, createJournal);
router.put('/:id', protect, updateJournal);
router.delete('/:id', protect, deleteJournal);

export default router;
