import { create } from 'zustand';
import safetyApi from '../services/api/safetyApi';
import useNotificationStore from './notificationStore';

export const useSafetyStore = create((set, get) => ({
  activeSOS: false,
  sosEvent: null,
  isTriggering: false,
  safeZones: [
    { id: 'sz1', name: 'Home Safe Zone', radiusMeters: 500, active: true, lat: 28.6139, lng: 77.2090 },
    { id: 'sz2', name: 'School Safe Zone', radiusMeters: 300, active: true, lat: 28.6200, lng: 77.2150 },
    { id: 'sz3', name: 'Therapy Center Zone', radiusMeters: 400, active: false, lat: 28.6050, lng: 77.2000 },
  ],
  contacts: [
    { id: 'c1', name: 'Priya Sharma (Mother)', phone: '+91 98765 43210', relationship: 'Guardian', primary: true },
    { id: 'c2', name: 'Dr. Anita Desai (Therapist)', phone: '+91 98111 22233', relationship: 'Therapist', primary: false },
    { id: 'c3', name: 'National Emergency Help', phone: '112', relationship: 'Emergency Service', primary: false },
  ],
  sosHistory: [
    {
      id: 'sos_1001',
      date: '2026-08-13 10:15 AM',
      location: 'City Mall Arcade, Main Floor',
      guardianNotified: 'Priya Sharma',
      status: 'Resolved',
    },
  ],

  triggerSOS: async (customLocation) => {
    set({ isTriggering: true });
    const location = customLocation || {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Delhi Public School Campus, Zone B',
      geofenceName: 'School Safe Zone',
    };

    const response = await safetyApi.triggerSOS({ location });
    const newEvent = {
      id: response.eventId || `sos_${Date.now()}`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: location.address,
      guardianNotified: 'Priya Sharma',
      status: 'Active',
      details: response,
    };

    set((state) => ({
      activeSOS: true,
      sosEvent: newEvent,
      isTriggering: false,
      sosHistory: [newEvent, ...state.sosHistory],
    }));

    // Add push alert notification in notificationStore
    useNotificationStore.getState().addNotification({
      id: `notif_${Date.now()}`,
      title: '🚨 Emergency SOS Dispatched',
      message: `Guardian Priya Sharma notified with location: ${location.address}`,
      time: 'Just now',
      read: false,
      type: 'SAFETY',
    });

    return response;
  },

  resolveSOS: async () => {
    const event = get().sosEvent;
    if (event?.id) {
      await safetyApi.resolveSOS(event.id);
    }
    set({ activeSOS: false, sosEvent: null });
  },

  addSafeZone: (newZone) =>
    set((state) => ({
      safeZones: [...state.safeZones, { ...newZone, id: `sz_${Date.now()}` }],
    })),

  toggleSafeZone: (zoneId) =>
    set((state) => ({
      safeZones: state.safeZones.map((z) =>
        z.id === zoneId ? { ...z, active: !z.active } : z
      ),
    })),
}));

export default useSafetyStore;
