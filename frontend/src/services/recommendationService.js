import api from './api.js';

const recommendationService = {
  getRecommendations: (subject) =>
    api.get('/recommendations', { params: subject ? { subject } : {} }),
};

export default recommendationService;
