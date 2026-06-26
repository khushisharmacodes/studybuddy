import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, trim: true, default: 'Daily Reflection' },
    content: { type: String, required: true },
    mood: { type: String, enum: ['happy', 'calm', 'tired', 'stressed', 'motivated', 'sad'], default: 'calm' },
    productivityRating: { type: Number, min: 1, max: 10, default: 5 },
    tags: [{ type: String }],
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

journalSchema.index({ user: 1, createdAt: -1 });
journalSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Journal = mongoose.model('Journal', journalSchema);
export default Journal;
