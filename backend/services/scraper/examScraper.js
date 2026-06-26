import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import logger from '../../utils/logger.js';

const NIT_KKR_BASE = 'https://www.nitkkr.ac.in/';

const axiosInstance = axios.create({
  timeout: 15000,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

const examKeywords = /exam|schedule|date sheet|timetable|practical|mid[\s-]?term|end[\s-]?term/i;
const postponementKeywords = /postpone|postponed|reschedule|revised|re-schedule/i;

const parseDateFromText = (text) => {
  if (!text) return null;

  // Look for patterns like: 15-04-2024, 15/04/2024, April 15 2024, 15 April 2024
  const patterns = [
    /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
    /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})[,\s]+(\d{4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const parsed = new Date(match[0]);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  }

  return null;
};

const inferSubject = (text) => {
  const subjects = ['DSA', 'OS', 'DBMS', 'ML', 'Web Dev', 'Networks', 'Compiler', 'Maths', 'Physics', 'Chemistry'];
  const upper = text.toUpperCase();
  for (const subject of subjects) {
    if (upper.includes(subject.toUpperCase())) return subject;
  }
  return 'General';
};

const inferExamType = (text) => {
  const upper = text.toUpperCase();
  if (upper.includes('PRACTICAL')) return 'practical';
  if (/MID[\s-]?TERM/.test(upper)) return 'midterm';
  if (/END[\s-]?TERM/.test(upper) || upper.includes('SEMESTER')) return 'endterm';
  if (/QUIZ|TEST/.test(upper)) return 'quiz';
  return 'other';
};

const resolveUrl = (href) => {
  if (!href) return NIT_KKR_BASE;
  if (href.startsWith('http')) return href;
  return `${NIT_KKR_BASE}${href.replace(/^\//, '')}`;
};

const scrapeExams = async () => {
  try {
    const { data } = await axiosInstance.get(NIT_KKR_BASE);
    const $ = cheerio.load(data);
    const exams = [];
    const seenUrls = new Set();

    $('a').each((_, el) => {
      const title = $(el).text().trim();
      if (!title || !examKeywords.test(title)) return;

      const href = $(el).attr('href') || '';
      const sourceUrl = resolveUrl(href);
      if (seenUrls.has(sourceUrl)) return;
      seenUrls.add(sourceUrl);

      const parentText = $(el).parent().text().trim();
      const combinedText = `${title} ${parentText}`;

      const date = parseDateFromText(combinedText);
      const isPostponed = postponementKeywords.test(combinedText) && /postpone/i.test(combinedText);
      const isRevised = /revised|re-schedule/i.test(combinedText);

      exams.push({
        title: title.replace(/\s+/g, ' ').slice(0, 200),
        subject: inferSubject(title),
        date,
        type: inferExamType(title),
        sourceUrl,
        college: 'NIT Kurukshetra',
        isPostponed,
        isRevised,
        status: isPostponed ? 'postponed' : 'scheduled',
      });
    });

    logger.info(`Scraped ${exams.length} exam items from NIT Kurukshetra`);
    return exams.slice(0, 15);
  } catch (error) {
    logger.error(`Exam scraping failed: ${error.message}`);
    return [];
  }
};

export { scrapeExams };
