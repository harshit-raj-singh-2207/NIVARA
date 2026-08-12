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
