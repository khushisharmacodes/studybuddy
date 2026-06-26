import Exam from '../models/Exam.js';
import User from '../models/User.js';
import { textMatchesSubjects } from '../utils/subjectMatcher.js';

const getExams = async (req, res, next) => {
  try {
    const { upcoming } = req.query;
    const user = await User.findById(req.user._id);
    const userSubjects = user?.subjects || [];

    let filter = {};
    if (upcoming === 'true') {
      filter.$or = [
        { date: { $gte: new Date() } },
        { date: null },
      ];
    }

    const exams = await Exam.find(filter).sort({ date: 1, lastCheckedAt: -1 }).limit(50);

    // Only show exams that are relevant to the user's course/subjects.
    const relevantExams = userSubjects.length > 0
      ? exams.filter((exam) => textMatchesSubjects(exam.subject || exam.title || '', userSubjects))
      : exams;

    res.json({ success: true, exams: relevantExams.slice(0, 20) });
  } catch (error) {
    next(error);
  }
};

const getExamStatus = async (req, res, next) => {
  try {
    const latest = await Exam.findOne().sort({ lastCheckedAt: -1 });
    const lastCheckedAt = latest?.lastCheckedAt || null;

    res.json({
      success: true,
      hasUpdate: !!latest,
      lastCheckedAt,
      message: latest
        ? 'Latest schedule data is available. Dates shown are parsed from official notices; unparseable dates are marked as TBA.'
        : 'Updated exam schedule has not been uploaded yet. Awaiting official notice from NIT Kurukshetra.',
    });
  } catch (error) {
    next(error);
  }
};

export { getExams, getExamStatus };
