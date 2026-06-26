import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String },
    sourceUrl: { type: String },
    pdfUrl: { type: String },
    category: { type: String, enum: ['exam', 'academic', 'general', 'postponement', 'revision'], default: 'general' },
    college: { type: String, default: 'NIT Kurukshetra' },
    publishedAt: { type: Date },
    scrapedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

noticeSchema.index({ category: 1, createdAt: -1 });

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
