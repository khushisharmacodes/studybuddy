import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['video', 'article', 'playlist', 'sheet', 'notes', 'tutorial', 'productivity'], required: true },
    url: { type: String },
    thumbnail: { type: String },
    category: { type: String, required: true },
    reason: { type: String },
    relevanceScore: { type: Number, min: 0, max: 100, default: 50 },
    isViewed: { type: Boolean, default: false },
    isSaved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

recommendationSchema.index({ user: 1, createdAt: -1 });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
