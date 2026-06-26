import Notice from '../../models/Notice.js';
import Exam from '../../models/Exam.js';
import logger from '../../utils/logger.js';

const detectNewNotices = async (scrapedNotices) => {
  const newItems = [];
  const now = new Date();

  for (const item of scrapedNotices) {
    const existing = await Notice.findOne({ sourceUrl: item.sourceUrl });
    if (!existing) {
      const notice = await Notice.create({ ...item, scrapedAt: now, lastCheckedAt: now });
      newItems.push(notice);
    } else {
      existing.lastCheckedAt = now;
      if (existing.title !== item.title || existing.content !== item.content) {
        existing.title = item.title;
        existing.content = item.content;
        existing.category = item.category;
        await existing.save();
        newItems.push(existing);
      } else {
        await existing.save();
      }
    }
  }

  logger.info(`Detected ${newItems.length} new or updated notices`);
  return newItems;
};

const detectExamChanges = async (scrapedExams) => {
  const changes = [];
  const now = new Date();

  for (const item of scrapedExams) {
    const existing = await Exam.findOne({ sourceUrl: item.sourceUrl });
    if (!existing) {
      const exam = await Exam.create({ ...item, scrapedAt: now, lastCheckedAt: now });
      changes.push(exam);
    } else {
      existing.lastCheckedAt = now;
      const titleChanged = existing.title !== item.title;
      const dateChanged = Boolean(item.date) && (!existing.date || existing.date.getTime() !== item.date.getTime());
      const statusChanged = existing.status !== item.status;

      if (titleChanged || dateChanged || statusChanged) {
        existing.title = item.title;
        existing.subject = item.subject;
        if (item.date) existing.date = item.date;
        existing.type = item.type;
        existing.isPostponed = item.isPostponed;
        existing.isRevised = item.isRevised;
        existing.status = item.status;
        await existing.save();
        changes.push(existing);
      } else {
        await existing.save();
      }
    }
  }

  logger.info(`Detected ${changes.length} new or updated exams`);
  return changes;
};

export { detectNewNotices, detectExamChanges };
