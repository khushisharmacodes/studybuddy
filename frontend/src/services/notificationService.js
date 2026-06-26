import api from './api.js';

const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: () => api.put('/notifications/read'),
};

export default notificationService;
