import api from './api.js';

const pomodoroService = {
  startSession: (data) => api.post('/pomodoro/start', data),
  completeSession: (sessionId) => api.put(`/pomodoro/complete/${sessionId}`),
  abandonSession: (sessionId, data) => api.put(`/pomodoro/abandon/${sessionId}`, data),
  getSessions: () => api.get('/pomodoro'),
  getTodayStats: () => api.get('/pomodoro/today'),
};

export default pomodoroService;
