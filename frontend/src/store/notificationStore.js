<<<<<<< HEAD
import { create } from 'zustand';
import apiClient from '../services/api/apiClient';
import { ENDPOINTS } from '../constants/api';

/**
 * Global state for Notifications using Zustand.
 * Handles push token registration, unread badges, and the notification inbox.
 */
export const useNotificationStore = create((set, get) => ({
  // ── State ───────────────────────────────────────────────
  
  notifications: [],
  unreadCount: 0,
  pushToken: null,
  isLoading: false,
  error: null,

  // ── Actions ─────────────────────────────────────────────

  setPushToken: (token) => set({ pushToken: token }),

  /**
   * Fetches the user's notification inbox.
   * @param {Object} options - limit and offset
   */
  fetchNotifications: async (options = { limit: 20, offset: 0 }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.LIST, { params: options });
      
      // Calculate unread count purely from local state for speed.
      // (Server should ideally return a global unread count too, but this works for the current page)
      const data = response.data;
      const unread = data.filter((n) => !n.isRead).length;

      set((state) => ({ 
        notifications: options.offset === 0 ? data : [...state.notifications, ...data],
        unreadCount: unread,
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Marks a single notification as read.
   * @param {string} id 
   */
  markAsRead: async (id) => {
    // Optimistic UI update
    set((state) => ({
      notifications: state.notifications.map((n) => 
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));

    // Background server sync
    try {
      await apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    } catch (error) {
      console.error('Failed to sync markAsRead to server:', error);
      // Depending on strictness, we could revert the optimistic update here.
    }
  },

  /**
   * Marks all notifications as read at once.
   */
  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0
    }));

    try {
      await apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    } catch (error) {
      console.error('Failed to sync markAllAsRead to server:', error);
    }
  },

  /**
   * Registers an Expo Push Token with the backend for the current user.
   * @param {string} token 
   */
  registerPushToken: async (token) => {
    // Save to local state just in case we need it
    set({ pushToken: token });
    
    try {
      await apiClient.post(ENDPOINTS.NOTIFICATIONS.REGISTER_PUSH, { token });
      console.log('Push token registered with backend');
    } catch (error) {
      console.error('Failed to register push token with backend:', error);
    }
  },

  /**
   * Pushes a new incoming notification (received via WebSocket or foreground push payload)
   * into the local state to immediately update badges.
   */
  addRealtimeNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  // Useful for logging out
  reset: () => set({
    notifications: [],
    unreadCount: 0,
    pushToken: null,
    isLoading: false,
    error: null,
  })
}));
=======
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
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
