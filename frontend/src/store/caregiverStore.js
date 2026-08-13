import { create } from 'zustand';
import { caregiverApi } from '../services/api/caregiverApi';

/**
 * Global state for the Caregiver Module using Zustand.
 * Used by the parents/guardians observing the supported individuals (Part 2).
 */
export const useCaregiverStore = create((set, get) => ({
  // ── State ───────────────────────────────────────────────
  
  isLoading: false,
  error: null,
  
  // Dashboard Aggregator
  dashboardSummary: null,

  // Selected Context (if caregiver is viewing a specific child's page)
  selectedChildId: null,
  selectedChildStatus: null,
  selectedChildEvents: [],

  // Preferences
  preferences: null,

  // ── Actions ─────────────────────────────────────────────

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  /**
   * Sets the globally active child ID (useful when navigating into a child's detail view)
   */
  setSelectedChildId: (id) => set({ selectedChildId: id }),

  // ── Data Fetching ───────────────────────────────────────

  /**
   * Fetches the high-level dashboard data for all assigned children.
   */
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const dashboard = await caregiverApi.getDashboard();
      set({ dashboardSummary: dashboard, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Fetches the detailed real-time status and recent events for one specific child.
   * @param {string} childId 
   */
  fetchChildDetail: async (childId) => {
    set({ isLoading: true, error: null });
    try {
      const [status, events] = await Promise.all([
        caregiverApi.getChildStatus(childId),
        caregiverApi.getChildSafetyEvents(childId)
      ]);
      
      set({ 
        selectedChildStatus: status, 
        selectedChildEvents: events,
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Fetch caregiver notification routing preferences.
   */
  fetchPreferences: async () => {
    try {
      const prefs = await caregiverApi.getPreferences();
      set({ preferences: prefs });
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    }
  },

  /**
   * Updates notification routing preferences on server and in local state.
   */
  updatePreferences: async (updates) => {
    try {
      const updated = await caregiverApi.updatePreferences(updates);
      set({ preferences: updated });
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  /**
   * Optional manual injection of a real-time event via WebSockets (Part 3/4 integration)
   * to immediately update UI without polling.
   */
  injectRealtimeEvent: (event, relatedChildId) => {
    set((state) => {
      const updates = {};
      
      // If we are currently looking at this child's detail page, update their feed
      if (state.selectedChildId === relatedChildId) {
        updates.selectedChildEvents = [event, ...state.selectedChildEvents];
      }
      
      // (Advanced) We could also parse the event and update the dashboardSummary 
      // here if we wanted fully optimistic real-time UI mapping before polling again.

      return updates;
    });
  },

  // Useful for logging out
  reset: () => set({
    isLoading: false,
    error: null,
    dashboardSummary: null,
    selectedChildId: null,
    selectedChildStatus: null,
    selectedChildEvents: [],
    preferences: null,
  })
}));
