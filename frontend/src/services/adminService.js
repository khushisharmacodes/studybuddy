import api from './api.js';

const adminService = {
  getStats: () => api.get('/admin/stats'),
  createExam: (data) => api.post('/admin/exams', data),
  updateExam: (id, data) => api.put(`/admin/exams/${id}`, data),
  createNotice: (data) => api.post('/admin/notices', data),
  broadcastAnnouncement: (data) => api.post('/admin/announcements', data),
};

export default adminService;
