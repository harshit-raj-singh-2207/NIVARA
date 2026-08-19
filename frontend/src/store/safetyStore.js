import { create } from 'zustand';
import { safetyApi } from '../services/api/safetyApi';
import { EmergencyType, BandConnectionStatus } from '../types/safety';

/**
 * Global state for the Safety Module using Zustand.
 * Used by the autistic individual / supported user's app (Part 2).
 */
export const useSafetyStore = create((set, get) => ({
  // ── State ───────────────────────────────────────────────
  
  isLoading: false,
  error: null,

  // Emergency State
  activeEmergency: null, // null if safe, object if active
  emergencyCountdown: 0, // 0 = inactive, >0 = counting down to dispatch

  // Location State
  currentLocation: null,
  isTrackingActive: false,

  // Safe Zones
  safeZones: [],
  activeZoneViolations: [], // array of zone IDs currently violated

  // GPS Band State
  bandStatus: {
    isConnected: false,
    connectionState: BandConnectionStatus.DISCONNECTED,
    batteryLevel: null,
    deviceId: null,
    lastSeen: null,
  },

  // Data Lists
  events: [],
  contacts: [],

  // ── Actions ─────────────────────────────────────────────

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Data Fetching (Initial Load)
  fetchInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [emergency, zones, contacts, events] = await Promise.all([
        safetyApi.getActiveEmergency().catch(() => null),
        safetyApi.getSafeZones().catch(() => []),
        safetyApi.getContacts().catch(() => []),
        safetyApi.getEvents({ limit: 10 }).catch(() => []),
      ]);

      set({
        activeEmergency: emergency,
        safeZones: zones,
        contacts,
        events,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // ── Emergency Actions ───────────────────────────────────

  startSosCountdown: (seconds) => {
    set({ emergencyCountdown: seconds });
  },

  cancelSosCountdown: () => {
    set({ emergencyCountdown: 0 });
  },

  triggerEmergency: async (type = EmergencyType.SOS, location = null) => {
    set({ emergencyCountdown: 0, isLoading: true });
    try {
      const loc = location || get().currentLocation;
      const emergency = await safetyApi.createEmergency({ type, location: loc });
      set({ activeEmergency: emergency, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  resolveEmergency: async () => {
    const { activeEmergency } = get();
    if (!activeEmergency) return;
    
    set({ isLoading: true });
    try {
      await safetyApi.resolveEmergency(activeEmergency.id);
      set({ activeEmergency: null, isLoading: false });
      // Refresh events to show resolution in timeline
      get().refreshEvents();
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // ── Location & Zone Actions ─────────────────────────────

  setCurrentLocation: (location) => set({ currentLocation: location }),
  
  setTrackingActive: (isActive) => set({ isTrackingActive: isActive }),

  addSafeZone: (zone) => set((state) => ({ safeZones: [...state.safeZones, zone] })),
  
  removeSafeZone: (id) => set((state) => ({
    safeZones: state.safeZones.filter((z) => z.id !== id)
  })),

  // ── Band Actions ────────────────────────────────────────

  updateBandStatus: (updates) => set((state) => ({
    bandStatus: { ...state.bandStatus, ...updates }
  })),

  // ── Utility ─────────────────────────────────────────────

  refreshEvents: async () => {
    try {
      const events = await safetyApi.getEvents({ limit: 20 });
      set({ events });
    } catch (error) {
      console.error('Failed to refresh events:', error);
    }
  },

  // Useful for logging out
  reset: () => set({
    activeEmergency: null,
    emergencyCountdown: 0,
    currentLocation: null,
    isTrackingActive: false,
    safeZones: [],
    activeZoneViolations: [],
    events: [],
    contacts: [],
    error: null,
    bandStatus: {
      isConnected: false,
      connectionState: BandConnectionStatus.DISCONNECTED,
      batteryLevel: null,
      deviceId: null,
      lastSeen: null,
    }
  })
}));
