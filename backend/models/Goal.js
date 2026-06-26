import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    category: { type: String, default: 'general' },
    targetValue: { type: Number, default: 1 },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, default: 'sessions' },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1, type: 1, dueDate: 1 });

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
