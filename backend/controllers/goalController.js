import Goal from '../models/Goal.js';

const getGoals = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, goals });
  } catch (error) {
    next(error);
  }
};

const createGoal = async (req, res, next) => {
  try {
    const goal = await Goal.create({ user: req.user._id, ...req.body });
    res.status(201).json({ success: true, goal });
  } catch (error) {
    next(error);
  }
};

const updateGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const goal = await Goal.findOneAndUpdate({ _id: goalId, user: req.user._id }, req.body, { new: true });
    if (!goal) {
      res.status(404);
      throw new Error('Goal not found');
    }
    res.json({ success: true, goal });
  } catch (error) {
    next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const goal = await Goal.findOneAndDelete({ _id: goalId, user: req.user._id });
    if (!goal) {
      res.status(404);
      throw new Error('Goal not found');
    }
    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    next(error);
  }
};

export { getGoals, createGoal, updateGoal, deleteGoal };
