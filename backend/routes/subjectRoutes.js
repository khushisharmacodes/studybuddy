import express from 'express';
import { getSubjectsForUser, getAllBranchSubjects, branchSubjectMap } from '../utils/nitKkrSubjects.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { branch, semester, all } = req.query;

  if (all === 'true') {
    const allSubjects = new Set();
    Object.values(branchSubjectMap).forEach((semMap) => {
      Object.values(semMap).forEach((subjects) => {
        subjects.forEach((s) => allSubjects.add(s));
      });
    });
    return res.json({ success: true, subjects: [...allSubjects].sort() });
  }

  const subjects = getSubjectsForUser(branch, semester);
  res.json({ success: true, subjects });
});

export default router;
