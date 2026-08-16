import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const BACKGROUND_LOCATION_TASK = 'BACKGROUND_LOCATION_TASK';

/**
 * Define the global background task.
 * This runs even when the app is minimized or closed!
 */
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background Location Task Error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const latestLocation = locations[0];
    
    // TODO: In the future, this will ping safetyApi.js to send live location
    // safetyApi.updateLocation(latestLocation);
    
    if (__DEV__) {
      console.log('📍 [Background] Received location:', latestLocation.coords);
    }
  }
});

/**
 * Initialize and start tracking the device's location in the background
 */
export const startBackgroundLocation = async () => {
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== 'granted') {
    console.warn('Foreground location permission denied.');
    return false;
  }

  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus === 'granted') {
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60000,          // Every 60 seconds
      distanceInterval: 50,         // Value in meters
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Nivara Locating",
        notificationBody: "Monitoring safety zones in the background.",
      }
    });
    return true;
  } else {
    console.warn('Background location permission denied.');
    return false;
  }
};

/**
 * Stop tracking background location
 */
export const stopBackgroundLocation = async () => {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }
};
