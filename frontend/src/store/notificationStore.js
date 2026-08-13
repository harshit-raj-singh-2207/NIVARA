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
