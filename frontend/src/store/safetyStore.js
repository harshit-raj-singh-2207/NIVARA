/**
 * Safety Zustand Store for NIVARA frontend.
 * Manages live GPS location, BLE Smart Band telemetry, safe zone geofences, and emergency contacts.
 */

import { create } from 'zustand';
import safetyApi from '../services/api/safetyApi';
import bandConnection from '../services/bluetooth/bandConnection';
import locationService from '../services/location/locationService';

export const useSafetyStore = create((set, get) => ({
  location: {
    latitude: 37.7749,
    longitude: -122.4194,
    address: '124 Sensory Safe Haven, Innovation Hub, Tech City',
    isInsideSafeZone: true,
  },
  bandState: {
    isConnected: true,
    deviceName: 'NIVARA Smart Band #402',
    batteryLevel: 88,
    signalStrength: -65,
    isSeparated: false,
  },
  safeZones: [
    { id: 'sz_1', name: 'Home Safe Zone', radiusMeters: 500, active: true },
    { id: 'sz_2', name: 'School / Work Zone', radiusMeters: 300, active: true },
  ],
  emergencyContacts: [
    { id: 'c1', name: 'Eleanor Vance', relationship: 'Primary Caregiver', phone: '+1 (555) 234-5678', isPrimary: true },
    { id: 'c2', name: 'Dr. Robert Marcus', relationship: 'Specialist Physician', phone: '+1 (555) 876-5432', isPrimary: false },
  ],
  isSosTriggered: false,
  isLoading: false,
  error: null,

  fetchSafetyOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const loc = await locationService.getCurrentLocation();
      const band = await bandConnection.checkBandConnection();
      const zones = await safetyApi.getSafeZones();
      set({
        location: loc,
        bandState: band,
        safeZones: zones,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  triggerEmergencySOS: async () => {
    set({ isSosTriggered: true });
    try {
      const { location } = get();
      await safetyApi.triggerSOSAlert(location);
    } catch (err) {
      console.warn('SOS dispatch warning:', err);
    }
  },

  updateLocation: (newLocation) => set({ location: newLocation }),
}));

export default useSafetyStore;
