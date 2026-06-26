import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import logger from '../../utils/logger.js';

const NIT_KKR_BASE = 'https://www.nitkkr.ac.in/';

const axiosInstance = axios.create({
  timeout: 15000,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

const noticeKeywords = /notice|circular|notification|announcement|postpone|revised|schedule|timetable|exam/i;
const pdfRegex = /\.pdf$/i;

const resolveUrl = (href) => {
  if (!href) return NIT_KKR_BASE;
  if (href.startsWith('http')) return href;
  return `${NIT_KKR_BASE}${href.replace(/^\//, '')}`;
};

const categorizeNotice = (title, href) => {
  const text = `${title} ${href}`.toLowerCase();
  if (/postpone|postponed/.test(text)) return 'postponement';
  if (/revised|re-schedule|reschedule/.test(text)) return 'revision';
  if (/exam|date sheet|timetable|schedule/.test(text)) return 'exam';
  if (/academic|class|lecture/.test(text)) return 'academic';
  return 'general';
};

const scrapeNotices = async () => {
  try {
    const { data } = await axiosInstance.get(NIT_KKR_BASE);
    const $ = cheerio.load(data);
    const notices = [];
    const seenUrls = new Set();

    $('a').each((_, el) => {
      const title = $(el).text().trim();
      if (!title || !noticeKeywords.test(title)) return;

      const href = $(el).attr('href') || '';
      const sourceUrl = resolveUrl(href);
      if (seenUrls.has(sourceUrl)) return;
      seenUrls.add(sourceUrl);

      const category = categorizeNotice(title, href);
      const content = $(el).parent().text().trim().slice(0, 500);

      notices.push({
        title: title.replace(/\s+/g, ' ').slice(0, 200),
        content: content || title,
        sourceUrl,
        pdfUrl: pdfRegex.test(href) ? sourceUrl : null,
        category,
        college: 'NIT Kurukshetra',
      });
    });

    logger.info(`Scraped ${notices.length} notices from NIT Kurukshetra`);
    return notices.slice(0, 20);
  } catch (error) {
    logger.error(`Notice scraping failed: ${error.message}`);
    return [];
  }
};

export { scrapeNotices };
