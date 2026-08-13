<<<<<<< HEAD
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
=======
/**
 * Caregiver Zustand Store for NIVARA frontend.
 * Manages linked dependent children, active selected child, live emergency alert status, and telemetry updates.
 */

import { create } from 'zustand';
import caregiverApi from '../services/api/caregiverApi';

export const useCaregiverStore = create((set, get) => ({
  dependents: [
    {
      id: 'child_1',
      name: 'Alex Vance',
      avatar: '👦',
      age: '12',
      isOnline: true,
      emotionalState: 'Calm',
      noiseDb: 72,
      location: {
        address: '124 Sensory Safe Haven, Innovation Hub, Tech City',
        latitude: 37.7749,
        longitude: -122.4194,
        isInsideSafeZone: true,
        lastUpdated: 'Just now',
      },
      routine: {
        activeTaskTitle: 'Morning Hygiene & Bathing',
        progressPercentage: 60,
        completedCount: 3,
        totalCount: 5,
      },
      device: {
        deviceName: 'NIVARA Smart Band #402',
        batteryLevel: 88,
        isConnected: true,
        isSeparated: false,
      },
    },
  ],
  activeDependentId: 'child_1',
  activeEmergencyAlert: null,
  isLoading: false,
  error: null,

  setActiveDependentId: (id) => set({ activeDependentId: id }),
  dismissEmergencyAlert: () => set({ activeEmergencyAlert: null }),

  fetchCaregiverDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await caregiverApi.getLinkedDependents();
      const list = Array.isArray(data) ? data : [data];
      set({
        dependents: list,
        activeDependentId: list[0]?.id || 'child_1',
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  sendCheckIn: async (message) => {
    const { activeDependentId } = get();
    await caregiverApi.sendQuickCheckIn(activeDependentId, message);
  },

  adjustSensoryLimit: async (newDb) => {
    const { activeDependentId } = get();
    await caregiverApi.adjustSensoryRemote(activeDependentId, newDb);
  },

  simulateEmergencyAlert: (alertObj) => {
    set({ activeEmergencyAlert: alertObj });
  },
}));

export default useCaregiverStore;
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
