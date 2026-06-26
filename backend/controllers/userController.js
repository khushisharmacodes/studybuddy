import User from '../models/User.js';
import { getSubjectsForUser } from '../utils/nitKkrSubjects.js';

const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const allowed = ['name', 'college', 'branch', 'semester', 'dailyStudyGoal', 'interests', 'preferredCategories', 'focusSound', 'theme', 'activeTeddy', 'subjects'];
    const filtered = {};
    Object.keys(updates).forEach((key) => {
      if (allowed.includes(key)) filtered[key] = updates[key];
    });

    // Recompute subjects if branch or semester changed
    const currentUser = await User.findById(req.user._id);
    const newBranch = filtered.branch !== undefined ? filtered.branch : currentUser.branch;
    const newSemester = filtered.semester !== undefined ? filtered.semester : currentUser.semester;

    if (filtered.branch !== undefined || filtered.semester !== undefined) {
      filtered.subjects = getSubjectsForUser(newBranch, newSemester);
    }

    const user = await User.findByIdAndUpdate(req.user._id, filtered, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export { updateProfile };
