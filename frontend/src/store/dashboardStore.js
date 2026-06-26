import { create } from 'zustand';
import analyticsService from '../services/analyticsService.js';
import recommendationService from '../services/recommendationService.js';
import examService from '../services/examService.js';
import markService from '../services/markService.js';

const useDashboardStore = create((set, get) => ({
  analytics: null,
  recommendations: [],
  exams: [],
  examStatus: null,
  weakSubjects: [],
  quote: '',
  isLoading: false,

  quotes: [
    'Small steps every day lead to big results.',
    'Your future is created by what you do today, not tomorrow.',
    'Focus on being productive instead of busy.',
    'The secret of getting ahead is getting started.',
    'Discipline is the bridge between goals and accomplishment.',
    'Study hard, stay cozy, trust the process.',
  ],

  loadDashboard: async () => {
    set({ isLoading: true });
    try {
      const [analyticsRes, recRes, examRes, statusRes, weakRes] = await Promise.allSettled([
        analyticsService.getDashboardAnalytics(),
        recommendationService.getRecommendations(),
        examService.getExams('true', 'true'),
        examService.getExamStatus(),
        markService.getWeakSubjects(),
      ]);

      const quote = get().quotes[Math.floor(Math.random() * get().quotes.length)];

      set({
        analytics: analyticsRes.status === 'fulfilled' ? analyticsRes.value.data : null,
        recommendations: recRes.status === 'fulfilled' ? recRes.value.data.recommendations : [],
        exams: examRes.status === 'fulfilled' ? examRes.value.data.exams : [],
        examStatus: statusRes.status === 'fulfilled' ? statusRes.value.data : null,
        weakSubjects: weakRes.status === 'fulfilled' ? weakRes.value.data.weakSubjects : [],
        quote,
        isLoading: false,
      });
    } catch (error) {
      console.error('Dashboard load failed:', error);
      set({ isLoading: false });
    }
  },
}));

export default useDashboardStore;
