import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, default: 'General', trim: true },
    date: { type: Date },
    time: { type: String },
    venue: { type: String },
    type: { type: String, enum: ['midterm', 'endterm', 'quiz', 'practical', 'other'], default: 'other' },
    sourceUrl: { type: String },
    pdfUrl: { type: String },
    college: { type: String, default: 'NIT Kurukshetra' },
    isPostponed: { type: Boolean, default: false },
    isRevised: { type: Boolean, default: false },
    status: { type: String, enum: ['scheduled', 'postponed', 'cancelled', 'completed'], default: 'scheduled' },
    scrapedAt: { type: Date, default: Date.now },
    lastCheckedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

examSchema.index({ date: 1 });

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
