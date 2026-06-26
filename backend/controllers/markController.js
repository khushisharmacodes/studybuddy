import Mark from '../models/Mark.js';

const normalizeExamType = (type) => {
  const lower = String(type).toLowerCase();
  const valid = ['quiz', 'midterm', 'endterm', 'practical', 'assignment', 'other'];
  return valid.includes(lower) ? lower : 'other';
};

const getMarks = async (req, res, next) => {
  try {
    const marks = await Mark.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, marks });
  } catch (error) {
    next(error);
  }
};

const createMark = async (req, res, next) => {
  try {
    const { subject, examType, maxMarks, obtainedMarks, date, notes } = req.body;

    if (obtainedMarks > maxMarks) {
      res.status(400);
      throw new Error('Obtained marks cannot be greater than maximum marks');
    }

    const mark = await Mark.create({
      user: req.user._id,
      subject,
      examType: normalizeExamType(examType),
      maxMarks,
      obtainedMarks,
      date: date || new Date(),
      notes,
    });
    res.status(201).json({ success: true, mark });
  } catch (error) {
    next(error);
  }
};

const getWeakSubjects = async (req, res, next) => {
  try {
    const marks = await Mark.find({ user: req.user._id });
    const subjectMap = {};
    marks.forEach((m) => {
      if (!subjectMap[m.subject]) subjectMap[m.subject] = [];
      subjectMap[m.subject].push(m.percentage);
    });

    const weakSubjects = Object.entries(subjectMap)
      .map(([subject, percentages]) => ({
        subject,
        average: percentages.reduce((a, b) => a + b, 0) / percentages.length,
      }))
      .filter((s) => s.average < 60)
      .sort((a, b) => a.average - b.average);

    res.json({ success: true, weakSubjects });
  } catch (error) {
    next(error);
  }
};

export { getMarks, createMark, getWeakSubjects };
