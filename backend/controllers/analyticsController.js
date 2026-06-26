import PomodoroSession from '../models/PomodoroSession.js';
import Mark from '../models/Mark.js';
import Goal from '../models/Goal.js';

const getDashboardAnalytics = async (req, res, next) => {
  try {
    const now = new Date();

    // Last 7 days for weekly trend
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Last 30 days for heatmap
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [weeklySessions, monthlySessions, completedGoals, totalGoals] = await Promise.all([
      PomodoroSession.find({
        user: req.user._id,
        status: 'completed',
        startedAt: { $gte: sevenDaysAgo },
      }),
      PomodoroSession.find({
        user: req.user._id,
        status: 'completed',
        startedAt: { $gte: thirtyDaysAgo },
      }),
      Goal.countDocuments({ user: req.user._id, isCompleted: true }),
      Goal.countDocuments({ user: req.user._id }),
    ]);

    const dailyMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      dailyMap[d.toISOString().split('T')[0]] = 0;
    }

    weeklySessions.forEach((s) => {
      const dateKey = new Date(s.startedAt).toISOString().split('T')[0];
      if (dailyMap[dateKey] !== undefined) dailyMap[dateKey] += s.duration;
    });

    const focusData = Object.entries(dailyMap)
      .map(([date, minutes]) => ({ date, minutes }))
      .reverse();

    // Heatmap data (last 30 days)
    const heatmapMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      heatmapMap[d.toISOString().split('T')[0]] = 0;
    }

    monthlySessions.forEach((s) => {
      const dateKey = new Date(s.startedAt).toISOString().split('T')[0];
      if (heatmapMap[dateKey] !== undefined) heatmapMap[dateKey] += s.duration;
    });

    const heatmapData = Object.entries(heatmapMap)
      .map(([date, minutes]) => ({ date, minutes }))
      .reverse();

    // Category breakdown
    const categoryMap = {};
    weeklySessions.forEach((s) => {
      categoryMap[s.category] = (categoryMap[s.category] || 0) + s.duration;
    });
    const categoryData = Object.entries(categoryMap)
      .map(([category, minutes]) => ({ category, minutes }))
      .sort((a, b) => b.minutes - a.minutes);

    const totalFocusMinutes = weeklySessions.reduce((acc, s) => acc + s.duration, 0);
    const totalSessions = weeklySessions.length;

    // Insights
    const bestDay = focusData.reduce((max, day) => (day.minutes > max.minutes ? day : max), focusData[0] || { date: '-', minutes: 0 });
    const activeDays = focusData.filter((d) => d.minutes > 0).length;
    const averageMinutes = activeDays > 0 ? Math.round(totalFocusMinutes / activeDays) : 0;

    const weakSubjects = await Mark.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$subject', avg: { $avg: '$percentage' } } },
      { $match: { avg: { $lt: 60 } } },
      { $sort: { avg: 1 } },
    ]);

    res.json({
      success: true,
      focusData,
      heatmapData,
      categoryData,
      totalFocusMinutes,
      totalSessions,
      completedGoals,
      totalGoals,
      insights: {
        bestDay,
        activeDays,
        averageMinutes,
        weakSubjects: weakSubjects.map((s) => ({ subject: s._id, average: s.avg })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getDashboardAnalytics };
