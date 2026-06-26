import api from './api.js';

const journalService = {
  getJournals: (search) => api.get('/journal', { params: { search } }),
  createJournal: (data) => api.post('/journal', data),
  updateJournal: (id, data) => api.put(`/journal/${id}`, data),
  deleteJournal: (id) => api.delete(`/journal/${id}`),
};

export default journalService;
