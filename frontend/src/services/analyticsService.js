import api from './api.js';

const analyticsService = {
  getDashboardAnalytics: () => api.get('/analytics/dashboard'),
};

export default analyticsService;
