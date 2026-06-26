import api from './api.js';

const examService = {
  getExams: (upcoming, mine) =>
    api.get('/exams', { params: { upcoming, mine } }),
  getExamStatus: () => api.get('/exams/status'),
};

export default examService;
