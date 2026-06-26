import api from './api.js';

const subjectService = {
  previewSubjects: (branch, semester) =>
    api.get('/subjects', { params: { branch, semester } }),
  getAllSubjects: () => api.get('/subjects', { params: { all: true } }),
};

export default subjectService;
