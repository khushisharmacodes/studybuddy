import mongoose from 'mongoose';

const markSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true, trim: true },
    examType: { type: String, enum: ['quiz', 'midterm', 'endterm', 'practical', 'assignment', 'other'], default: 'other' },
    maxMarks: { type: Number, required: true, min: 1 },
    obtainedMarks: { type: Number, required: true, min: 0 },
    percentage: { type: Number, min: 0, max: 100 },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

markSchema.pre('save', function (next) {
  if (this.maxMarks > 0) {
    this.percentage = (this.obtainedMarks / this.maxMarks) * 100;
  }
  next();
});

markSchema.index({ user: 1, subject: 1 });

const Mark = mongoose.model('Mark', markSchema);
export default Mark;
