/**
 * Location Service for NIVARA GPS Wearable & Geofence tracking.
 */

export const locationService = {
  getCurrentLocation: async () => {
    return {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '124 Sensory Safe Haven, Innovation Hub, Tech City',
      isInsideSafeZone: true,
    };
  },

  subscribeLocation: (callback) => {
    const interval = setInterval(() => {
      callback({
        latitude: 37.7749 + (Math.random() - 0.5) * 0.001,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.001,
        address: '124 Sensory Safe Haven, Innovation Hub, Tech City',
        isInsideSafeZone: true,
      });
    }, 5000);
    return () => clearInterval(interval);
  },
};

export default locationService;
