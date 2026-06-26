import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    dailyFocus: [
      {
        date: { type: Date, required: true },
        minutes: { type: Number, default: 0 },
        sessions: { type: Number, default: 0 },
      },
    ],
    categoryBreakdown: [{ category: String, minutes: Number }],
    weeklyReports: [
      {
        weekStart: Date,
        totalMinutes: Number,
        sessionsCompleted: Number,
        goalsAchieved: Number,
        weakSubjects: [String],
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
