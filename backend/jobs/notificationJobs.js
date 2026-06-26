import cron from 'node-cron';
import { runAllNotificationGenerators } from '../services/notification/notificationService.js';
import logger from '../utils/logger.js';

const startNotificationJobs = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running daily notification generators...');
    await runAllNotificationGenerators();
  });

  // Run every evening at 7:00 PM for streak reminders
  cron.schedule('0 19 * * *', async () => {
    logger.info('Running evening streak reminders...');
    await runAllNotificationGenerators();
  });

  logger.info('Notification cron jobs scheduled');
};

export { startNotificationJobs };
