import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService.js';
import usePomodoroStore from './pomodoroStore.js';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initAuth: () => {
        const token = localStorage.getItem('studybuddy_token');
        const user = localStorage.getItem('studybuddy_user');
        if (token && user) {
          set({ token, user: JSON.parse(user), isAuthenticated: true });
          get().fetchProfile();
        }
      },

      fetchProfile: async () => {
        try {
          const { data } = await authService.getMe();
          set({ user: data.user });
          localStorage.setItem('studybuddy_user', JSON.stringify(data.user));
        } catch (error) {
          console.error('Profile fetch failed:', error);
          get().logout();
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authService.login(credentials);
          localStorage.setItem('studybuddy_token', data.token);
          localStorage.setItem('studybuddy_user', JSON.stringify(data.user));
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
          return data;
        } catch (error) {
          set({ isLoading: false, error: error.response?.data?.message || error.message });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authService.register(userData);
          localStorage.setItem('studybuddy_token', data.token);
          localStorage.setItem('studybuddy_user', JSON.stringify(data.user));
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
          // New user should start with a clean pomodoro timer, not someone else's state.
          usePomodoroStore.getState().resetStore();
          return data;
        } catch (error) {
          set({ isLoading: false, error: error.response?.data?.message || error.message });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('studybuddy_token');
        localStorage.removeItem('studybuddy_user');
        // Reset the focus timer so the next user does not inherit the previous timer state.
        usePomodoroStore.getState().resetStore();
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      updateUser: (updates) => {
        const updated = { ...get().user, ...updates };
        set({ user: updated });
        localStorage.setItem('studybuddy_user', JSON.stringify(updated));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
