import PomodoroSession from '../models/PomodoroSession.js';
import User from '../models/User.js';

const startSession = async (req, res, next) => {
  try {
    const { category, duration, tags, notes } = req.body;
    const session = await PomodoroSession.create({
      user: req.user._id,
      category: category || 'General',
      duration: duration || 25,
      tags: tags || [],
      notes: notes || '',
      startedAt: new Date(),
      status: 'active',
    });
    res.status(201).json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

const completeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await PomodoroSession.findOneAndUpdate(
      { _id: sessionId, user: req.user._id, status: 'active' },
      { completed: true, status: 'completed', endedAt: new Date() },
      { new: true }
    );

    if (!session) {
      res.status(404);
      throw new Error('Active session not found');
    }

    const user = await User.findById(req.user._id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!user.lastStudyDate || user.lastStudyDate < today) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (user.lastStudyDate && user.lastStudyDate >= yesterday) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
      if (user.streak > user.longestStreak) user.longestStreak = user.streak;
      user.lastStudyDate = new Date();
    }
    user.addXP(session.duration);
    await user.save();

    res.json({ success: true, session, xpGained: session.duration });
  } catch (error) {
    next(error);
  }
};

const abandonSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { elapsedMinutes = 0 } = req.body;

    const session = await PomodoroSession.findOneAndUpdate(
      { _id: sessionId, user: req.user._id, status: 'active' },
      {
        status: 'abandoned',
        endedAt: new Date(),
        actualDuration: Math.max(0, Math.round(elapsedMinutes)),
      },
      { new: true }
    );

    if (!session) {
      res.status(404);
      throw new Error('Active session not found');
    }

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

const getSessions = async (req, res, next) => {
  try {
    const sessions = await PomodoroSession.find({ user: req.user._id }).sort({ startedAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};

const getTodayStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sessions = await PomodoroSession.find({
      user: req.user._id,
      status: 'completed',
      startedAt: { $gte: today, $lt: tomorrow },
    });

    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    res.json({ success: true, totalMinutes, sessionsCompleted: sessions.length });
  } catch (error) {
    next(error);
  }
};

export { startSession, completeSession, abandonSession, getSessions, getTodayStats };
