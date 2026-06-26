import api from './api.js';

const goalService = {
  getGoals: (type) => api.get('/goals', { params: { type } }),
  createGoal: (data) => api.post('/goals', data),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
};

export default goalService;
