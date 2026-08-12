/**
 * Notification & Safety Alert Zustand Store for NIVARA frontend.
 * Manages active notifications, unread count, category filtering, and emergency SOS alerts.
 */

import { create } from 'zustand';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: '🚨 EMERGENCY SOS TRIGGERED',
    message: 'High-priority SOS alert broadcasted from GPS Band #8819.',
    type: 'emergency',
    location: 'Home Geofence (37.7749° N, 122.4194° W)',
    timestamp: '2m ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: '🔊 High Noise Level Warning',
    message: 'Ambient noise level exceeded 85dB. Suggesting move to a quiet zone or noise-canceling headphones.',
    type: 'sensory',
    timestamp: '15m ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: '📅 Upcoming Routine Transition',
    message: 'Afternoon Sensory Rest & Calming Activity starts in 15 minutes.',
    type: 'routine',
    timestamp: '25m ago',
    read: false,
  },
  {
    id: 'notif-4',
    title: '🟢 Safe Zone Verification',
    message: 'User arrived safely within Home Geofence boundaries.',
    type: 'safety',
    location: 'Home Geofence',
    timestamp: '1h ago',
    read: true,
  },
];

export const useNotificationStore = create((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,
  unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,
  isLoading: false,
  sosActive: false,
  lastSosTimestamp: null,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const notifications = get().notifications;
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({ notifications, unreadCount, isLoading: false, error: null });
      return notifications;
    } catch (err) {
      set({ isLoading: false, error: err?.message || 'Failed to fetch notifications' });
      return get().notifications;
    }
  },

  triggerSosAlert: async (sosPayload = {}) => {
    set({ isLoading: true, sosActive: true, lastSosTimestamp: new Date().toISOString() });
    try {
      const sosNotif = {
        id: `sos-${Date.now()}`,
        title: '🚨 EMERGENCY SOS TRIGGERED',
        message: sosPayload.message || 'Emergency assistance requested!',
        type: 'emergency',
        location: 'Current GPS Location (37.7749° N, 122.4194° W)',
        timestamp: 'Just now',
        read: false,
      };

      set((state) => ({
        notifications: [sosNotif, ...state.notifications],
        unreadCount: state.unreadCount + 1,
        isLoading: false,
      }));

      return { success: true, message: 'Emergency SOS dispatched to caregivers and emergency contacts.' };
    } catch (err) {
      set({ isLoading: false, error: err?.message || 'Failed to trigger SOS' });
      throw err;
    }
  },

  cancelSosAlert: () => {
    set({ sosActive: false });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  deleteNotification: (id) => {
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
}));

export default useNotificationStore;
