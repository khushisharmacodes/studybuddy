import api from './api.js';

const markService = {
  getMarks: () => api.get('/marks'),
  createMark: (data) => api.post('/marks', data),
  getWeakSubjects: () => api.get('/marks/weak-subjects'),
};

export default markService;
