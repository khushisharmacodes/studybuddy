import cron from 'node-cron';
import {
  runAllNotificationGenerators,
  generateStreakBreakRiskNotifications,
  resetExpiredStreaks,
} from '../services/notification/notificationService.js';
import logger from '../utils/logger.js';

const startNotificationJobs = () => {
  // Run every day at 9:00 AM (exams, streaks, goals, weak subjects, study reminders)
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running daily notification generators...');
    await runAllNotificationGenerators();
  });

  // Run every evening at 8:00 PM for urgent streak-save reminders
  cron.schedule('0 20 * * *', async () => {
    logger.info('Running evening streak break-risk reminders...');
    await generateStreakBreakRiskNotifications();
  });

  // Run every night at 12:05 AM to reset streaks for users who missed yesterday
  cron.schedule('5 0 * * *', async () => {
    logger.info('Running nightly streak reset...');
    await resetExpiredStreaks();
  });

  logger.info('Notification cron jobs scheduled');
};

export { startNotificationJobs };
