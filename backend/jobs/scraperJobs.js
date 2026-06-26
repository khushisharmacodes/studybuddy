import cron from 'node-cron';
import { scrapeExams } from '../services/scraper/examScraper.js';
import { scrapeNotices } from '../services/scraper/noticeScraper.js';
import { detectNewNotices, detectExamChanges } from '../services/scraper/changeDetector.js';
import logger from '../utils/logger.js';

const runScrapers = async () => {
  logger.info('Running scheduled scrapers...');
  const exams = await scrapeExams();
  const notices = await scrapeNotices();
  await detectExamChanges(exams);
  await detectNewNotices(notices);
};

const startScraperJobs = () => {
  cron.schedule('0 */6 * * *', runScrapers);
  logger.info('Scraper cron job scheduled every 6 hours');
  runScrapers();
};

export { startScraperJobs, runScrapers };
