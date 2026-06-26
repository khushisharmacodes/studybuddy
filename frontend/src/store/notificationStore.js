import { create } from 'zustand';
import notificationService from '../services/notificationService.js';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await notificationService.getNotifications();
      set({ notifications: data.notifications, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAsRead();
      set({ notifications: get().notifications.map((n) => ({ ...n, isRead: true })) });
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
    }
  },

  unreadCount: () => get().notifications.filter((n) => !n.isRead).length,

  addNotification: (notification) => {
    set({ notifications: [notification, ...get().notifications] });
  },
}));

export default useNotificationStore;
