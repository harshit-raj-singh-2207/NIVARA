export const backgroundLocationService = {
  startBackgroundTracking: async () => {
    console.log('[BackgroundLocation] Started background location task');
    return true;
  },
  stopBackgroundTracking: async () => {
    console.log('[BackgroundLocation] Stopped background location task');
    return true;
  }
};

export default backgroundLocationService;
