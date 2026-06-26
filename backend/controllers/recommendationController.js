import User from '../models/User.js';
import PomodoroSession from '../models/PomodoroSession.js';
import Mark from '../models/Mark.js';
import Exam from '../models/Exam.js';
import { buildRecommendations } from '../services/recommendation/recommendationEngine.js';
import { textMatchesSubjects } from '../utils/subjectMatcher.js';
import { getSubjectsForUser, getAllBranchSubjects } from '../utils/nitKkrSubjects.js';

const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const topCategories = await PomodoroSession.aggregate([
      { $match: { user: user._id, status: 'completed' } },
      { $group: { _id: '$category', total: { $sum: '$duration' } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    const weakSubjects = await Mark.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: '$subject', avg: { $avg: '$percentage' } } },
      { $match: { avg: { $lt: 60 } } },
      { $sort: { avg: 1 } },
    ]);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const nextWeek = new Date(tomorrow);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingExams = await Exam.find({
      date: { $gte: tomorrow, $lt: nextWeek },
      isPostponed: false,
    }).limit(20);

    let userSubjects = user.subjects || [];
    // Fallback to all possible subjects for the user's branch if nothing is set.
    if (!userSubjects.length) {
      userSubjects = getAllBranchSubjects(user.branch);
    }

    // Only keep exams that are relevant to the user's current subjects.
    const relevantExams = upcomingExams.filter((exam) => {
      const examSubject = exam.subject || exam.title || '';
      return textMatchesSubjects(examSubject, userSubjects);
    });

    let signals = {
      topCategories: topCategories.map((c) => c._id),
      weakSubjects: weakSubjects.map((s) => s._id),
      upcomingExams: relevantExams.map((e) => e.subject || e.title),
      subjects: userSubjects,
      focusSubject: req.query.subject ? req.query.subject.trim() : undefined,
    };

    let recommendations = buildRecommendations(signals);

    // If still empty, broaden to every subject offered by the branch/semester.
    if (recommendations.length === 0) {
      signals = { ...signals, subjects: getAllBranchSubjects(user.branch) || getSubjectsForUser(user.branch, user.semester) };
      recommendations = buildRecommendations(signals);
    }

    res.json({ success: true, recommendations });
  } catch (error) {
    next(error);
  }
};

export { getRecommendations };
