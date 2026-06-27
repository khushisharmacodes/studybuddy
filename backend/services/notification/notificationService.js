import Notification from '../../models/Notification.js';
import User from '../../models/User.js';
import Goal from '../../models/Goal.js';
import Exam from '../../models/Exam.js';
import Mark from '../../models/Mark.js';
import logger from '../../utils/logger.js';
import { textMatchesSubjects } from '../../utils/subjectMatcher.js';

const createIfNotExists = async (userId, type, title, message, metadata = {}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await Notification.findOne({
    user: userId,
    type,
    createdAt: { $gte: today },
  });

  if (existing) return null;

  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    metadata,
  });

  return notification;
};

const generateExamNotifications = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const upcomingExams = await Exam.find({
      date: { $gte: tomorrow, $lt: dayAfterTomorrow },
      isPostponed: false,
    });

    if (upcomingExams.length === 0) return;

    const users = await User.find({ role: 'user' }).select('subjects');

    for (const user of users) {
      const userSubjects = user.subjects || [];
      if (userSubjects.length === 0) continue;

      const relevantExams = upcomingExams.filter((exam) =>
        textMatchesSubjects(exam.subject || exam.title || '', userSubjects)
      );

      for (const exam of relevantExams) {
        await createIfNotExists(
          user._id,
          'exam',
          `Exam tomorrow: ${exam.subject || exam.title}`,
          `${exam.title} is scheduled for tomorrow. Best of luck with your prep!`,
          { examId: exam._id }
        );
      }
    }

    logger.info(`Generated user-specific exam notifications for ${upcomingExams.length} exams`);
  } catch (error) {
    logger.error('Exam notification generation failed:', error);
  }
};

const generateStreakNotifications = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await User.find({
      streak: { $gt: 0 },
      $or: [
        { lastStudyDate: { $lt: today } },
        { lastStudyDate: { $exists: false } },
      ],
    });

    for (const user of users) {
      await createIfNotExists(
        user._id,
        'streak',
        'Keep your streak alive! 🔥',
        `You have a ${user.streak}-day streak. Study today to keep it going!`,
        { streak: user.streak }
      );
    }
    logger.info(`Generated morning streak notifications for ${users.length} users`);
  } catch (error) {
    logger.error('Streak notification generation failed:', error);
  }
};

const generateStreakBreakRiskNotifications = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await User.find({
      streak: { $gt: 0 },
      $or: [
        { lastStudyDate: { $lt: today } },
        { lastStudyDate: { $exists: false } },
      ],
    });

    for (const user of users) {
      await createIfNotExists(
        user._id,
        'streak_risk',
        'Your streak ends at midnight! ⏰',
        `You have a ${user.streak}-day streak. Start a quick focus session before midnight to keep it alive!`,
        { streak: user.streak }
      );
    }
    logger.info(`Generated streak break-risk notifications for ${users.length} users`);
  } catch (error) {
    logger.error('Streak break-risk notification generation failed:', error);
  }
};

const resetExpiredStreaks = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const result = await User.updateMany(
      { lastStudyDate: { $lt: yesterday }, streak: { $gt: 0 } },
      { $set: { streak: 0 } }
    );

    logger.info(`Reset expired streaks for ${result.modifiedCount} users`);
  } catch (error) {
    logger.error('Reset expired streaks failed:', error);
  }
};

const generateGoalNotifications = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const incompleteDailyGoals = await Goal.find({
      type: 'daily',
      isCompleted: false,
      createdAt: { $gte: today },
    }).populate('user', '_id');

    for (const goal of incompleteDailyGoals) {
      await createIfNotExists(
        goal.user._id,
        'goal',
        'Daily goal pending',
        `You still have "${goal.title}" on your list for today.`,
        { goalId: goal._id }
      );
    }
    logger.info(`Generated goal notifications for ${incompleteDailyGoals.length} goals`);
  } catch (error) {
    logger.error('Goal notification generation failed:', error);
  }
};

const generateWeakSubjectNotifications = async () => {
  try {
    const users = await User.find({ role: 'user' }).select('_id');

    for (const user of users) {
      const marks = await Mark.find({ user: user._id });
      const subjectScores = {};

      for (const mark of marks) {
        if (!subjectScores[mark.subject]) subjectScores[mark.subject] = [];
        subjectScores[mark.subject].push(mark.percentage);
      }

      const weakSubjects = Object.entries(subjectScores)
        .map(([subject, scores]) => ({
          subject,
          average: scores.reduce((a, b) => a + b, 0) / scores.length,
        }))
        .filter((s) => s.average < 60);

      if (weakSubjects.length > 0) {
        await createIfNotExists(
          user._id,
          'weak_subject',
          'Strengthen your weak subjects',
          `Your average in ${weakSubjects[0].subject} is ${Math.round(weakSubjects[0].average)}%. Let us work on it!`,
          { subject: weakSubjects[0].subject }
        );
      }
    }
    logger.info('Generated weak subject notifications');
  } catch (error) {
    logger.error('Weak subject notification generation failed:', error);
  }
};

const generateStudyReminderNotifications = async () => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);

    const users = await User.find({
      $or: [
        { lastStudyDate: { $lt: twoDaysAgo } },
        { lastStudyDate: { $exists: false } },
      ],
    });

    for (const user of users) {
      const subjects = user.subjects || [];
      const suggestion = subjects.length > 0
        ? `How about a quick session on ${subjects[0]}?`
        : 'Ready to start a focused session?';

      await createIfNotExists(
        user._id,
        'general',
        'We miss you! 🧸',
        `${suggestion} Your streak is waiting.`,
        {}
      );
    }
    logger.info('Generated user-specific study reminder notifications');
  } catch (error) {
    logger.error('Study reminder generation failed:', error);
  }
};

const runAllNotificationGenerators = async () => {
  await generateExamNotifications();
  await generateStreakNotifications();
  await generateGoalNotifications();
  await generateWeakSubjectNotifications();
  await generateStudyReminderNotifications();
};

export {
  generateExamNotifications,
  generateStreakNotifications,
  generateStreakBreakRiskNotifications,
  generateGoalNotifications,
  generateWeakSubjectNotifications,
  generateStudyReminderNotifications,
  resetExpiredStreaks,
  runAllNotificationGenerators,
};
