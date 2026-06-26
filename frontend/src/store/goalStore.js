import { create } from 'zustand';
import goalService from '../services/goalService.js';

const useGoalStore = create((set, get) => ({
  goals: [],
  isLoading: false,

  fetchGoals: async (type) => {
    set({ isLoading: true });
    try {
      const { data } = await goalService.getGoals(type);
      set({ goals: data.goals, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      set({ isLoading: false });
    }
  },

  addGoal: async (goalData) => {
    const { data } = await goalService.createGoal(goalData);
    set({ goals: [data.goal, ...get().goals] });
    return data.goal;
  },

  toggleGoal: async (id) => {
    const goal = get().goals.find((g) => g._id === id);
    if (!goal) return;
    const updated = { ...goal, isCompleted: !goal.isCompleted, currentValue: !goal.isCompleted ? goal.targetValue : 0 };
    try {
      const { data } = await goalService.updateGoal(id, updated);
      set({ goals: get().goals.map((g) => (g._id === id ? data.goal : g)) });
    } catch (error) {
      console.error(error);
    }
  },

  deleteGoal: async (id) => {
    try {
      await goalService.deleteGoal(id);
      set({ goals: get().goals.filter((g) => g._id !== id) });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useGoalStore;
