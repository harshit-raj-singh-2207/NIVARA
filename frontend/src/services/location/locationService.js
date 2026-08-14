export const locationService = {
  getCurrentLocation: async () => {
    return {
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: 5,
      timestamp: new Date().toISOString(),
    };
  },
  watchLocation: (callback) => {
    const interval = setInterval(() => {
      callback({
        latitude: 28.6139 + (Math.random() - 0.5) * 0.001,
        longitude: 77.2090 + (Math.random() - 0.5) * 0.001,
        accuracy: 4,
        timestamp: new Date().toISOString(),
      });
    }, 5000);
    return () => clearInterval(interval);
  }
};

export default locationService;
