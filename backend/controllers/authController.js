import { validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { getSubjectsForUser } from '../utils/nitKkrSubjects.js';

const buildUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  college: user.college,
  branch: user.branch,
  semester: user.semester,
  dailyStudyGoal: user.dailyStudyGoal,
  interests: user.interests,
  preferredCategories: user.preferredCategories,
  subjects: user.subjects,
  role: user.role,
  streak: user.streak,
  longestStreak: user.longestStreak,
  xp: user.xp,
  level: user.level,
  achievements: user.achievements,
  unlockedTeddies: user.unlockedTeddies,
  activeTeddy: user.activeTeddy,
  focusSound: user.focusSound,
  theme: user.theme,
});

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array()[0].msg));
  }

  try {
    const { name, email, password, college, branch, semester, dailyStudyGoal, interests, preferredCategories } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const subjects = getSubjectsForUser(branch, semester);

    const user = await User.create({
      name,
      email,
      password,
      college: college || '',
      branch: branch || '',
      semester: semester || 1,
      dailyStudyGoal: dailyStudyGoal || 120,
      interests: interests || [],
      preferredCategories: preferredCategories || [],
      subjects,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: buildUserResponse(user),
        token: generateToken({ id: user._id }),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array()[0].msg));
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: buildUserResponse(user),
        token: generateToken({ id: user._id }),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, getMe };
