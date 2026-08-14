import { create } from 'zustand';

export const useCaregiverStore = create((set, get) => ({
  activeChildId: 'ch_1',
  children: [
    {
      id: 'ch_1',
      name: 'Aarav Sharma',
      age: 9,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      currentMood: 'Calm & Happy',
      heartRate: 76,
      batteryLevel: 88,
      isDeviceConnected: true,
      inSafeZone: true,
      currentSafeZoneName: 'Home',
      lastLocation: 'B-12 Greenwood Enclave',
      routineProgress: '3 / 4 Tasks Done',
    }
  ],
  recentAlerts: [
    { id: 'ca_1', childId: 'ch_1', type: 'SAFE_ZONE_ENTERED', title: 'Entered Home Safe Zone', time: '10 mins ago', severity: 'INFO' },
    { id: 'ca_2', childId: 'ch_1', type: 'NOISE_EXPOSURE', title: 'High Ambient Noise (78dB)', time: '2 hours ago', severity: 'WARNING' },
  ],

  selectChild: (childId) => set({ activeChildId: childId }),
  
  clearAlerts: () => set({ recentAlerts: [] }),
}));

export default useCaregiverStore;
