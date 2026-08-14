/**
 * Caregiver Dashboard Types
 */

export const createChildStatus = (data = {}) => ({
  childId: data.childId || 'ch_1',
  name: data.name || 'Alex',
  age: data.age || 9,
  currentMood: data.currentMood || 'Calm',
  heartRate: data.heartRate || 76,
  batteryLevel: data.batteryLevel || 88,
  isDeviceConnected: data.isDeviceConnected ?? true,
  lastKnownLocation: data.lastKnownLocation || {
    address: 'Greenwood Elementary School',
    latitude: 28.6139,
    longitude: 77.2090,
    timestamp: new Date().toISOString(),
  },
  inSafeZone: data.inSafeZone ?? true,
  safeZoneName: data.safeZoneName || 'School',
});
