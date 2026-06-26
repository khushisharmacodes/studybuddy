import Exam from '../models/Exam.js';
import Notice from '../models/Notice.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      college: req.body.college || 'NIT Kurukshetra',
      scrapedAt: new Date(),
      lastCheckedAt: new Date(),
    });
    res.status(201).json({ success: true, exam });
  } catch (error) {
    next(error);
  }
};

const updateExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findByIdAndUpdate(
      examId,
      { ...req.body, lastCheckedAt: new Date() },
      { new: true }
    );
    if (!exam) {
      res.status(404);
      throw new Error('Exam not found');
    }
    res.json({ success: true, exam });
  } catch (error) {
    next(error);
  }
};

const createNotice = async (req, res, next) => {
  try {
    const notice = await Notice.create({
      ...req.body,
      college: req.body.college || 'NIT Kurukshetra',
      scrapedAt: new Date(),
      lastCheckedAt: new Date(),
    });
    res.status(201).json({ success: true, notice });
  } catch (error) {
    next(error);
  }
};

const broadcastAnnouncement = async (req, res, next) => {
  try {
    const { title, message, type = 'general' } = req.body;
    if (!title || !message) {
      res.status(400);
      throw new Error('Title and message are required');
    }

    const users = await User.find({ role: 'user' }).select('_id');
    const notifications = await Notification.insertMany(
      users.map((user) => ({
        user: user._id,
        title,
        message,
        type,
      }))
    );

    logger.info(`Admin broadcasted announcement to ${notifications.length} users`);
    res.json({ success: true, count: notifications.length });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [userCount, examCount, noticeCount, sessionCountDoc] = await Promise.all([
      User.countDocuments(),
      Exam.countDocuments(),
      Notice.countDocuments(),
      // Import PomodoroSession dynamically to avoid circular issues
      import('../models/PomodoroSession.js').then((m) => m.default.countDocuments()),
    ]);

    res.json({
      success: true,
      stats: {
        users: userCount,
        exams: examCount,
        notices: noticeCount,
        sessions: sessionCountDoc,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { createExam, updateExam, createNotice, broadcastAnnouncement, getStats };
