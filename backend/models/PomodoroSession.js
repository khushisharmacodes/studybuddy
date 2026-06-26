import mongoose from 'mongoose';

const pomodoroSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 },
    actualDuration: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    completed: { type: Boolean, default: false },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date },
    notes: { type: String, trim: true },
    tags: [{ type: String }],
    interruptions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pomodoroSessionSchema.index({ user: 1, startedAt: -1 });

const PomodoroSession = mongoose.model('PomodoroSession', pomodoroSessionSchema);
export default PomodoroSession;
