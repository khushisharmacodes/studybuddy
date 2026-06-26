import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please provide your name'], trim: true },
    email: { type: String, required: [true, 'Please provide your email'], unique: true, lowercase: true },
    password: { type: String, required: [true, 'Please provide a password'], minlength: 6, select: false },
    college: { type: String, default: '' },
    branch: { type: String, default: '' },
    semester: { type: Number, default: 1, min: 1, max: 12 },
    dailyStudyGoal: { type: Number, default: 120, min: 0 },
    interests: [{ type: String }],
    preferredCategories: [{ type: String }],
    subjects: [{ type: String }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastStudyDate: { type: Date },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    achievements: [{ type: String }],
    unlockedTeddies: [{ type: String }],
    activeTeddy: { type: String, default: 'default' },
    focusSound: { type: String, default: 'rain' },
    theme: { type: String, default: 'cozy' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.addXP = function (amount) {
  this.xp += amount;
  const nextLevel = this.level * 100;
  if (this.xp >= nextLevel) {
    this.level += 1;
    this.xp = this.xp - nextLevel;
  }
};

const User = mongoose.model('User', userSchema);
export default User;
