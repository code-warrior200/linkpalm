import { create } from 'zustand';
import { Notification } from '../types';

interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  getUnreadCount: (userId: string) => number;
  clearNotifications: (userId: string) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  isLoading: false,

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },

  markAsRead: (notificationId: string) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
    }));
  },

  markAllAsRead: (userId: string) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.userId === userId ? { ...notif, read: true } : notif
      ),
    }));
  },

  getUnreadCount: (userId: string) => {
    return get().notifications.filter((notif) => notif.userId === userId && !notif.read).length;
  },

  clearNotifications: (userId: string) => {
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.userId !== userId),
    }));
  },
}));

