import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { checkPermission } from '../../utils/permissionUtils';
import { PERMISSION_TYPES, PERMISSION_STATUS } from '../../constants/permissions';
import { GEOFENCE_CONFIG } from '../../constants/config';
import { safetyApi } from '../api/safetyApi';

const GEOFENCE_TASK = GEOFENCE_CONFIG.taskName;

/**
 * Defines the background task that Expo calls when a geofence is crossed.
 * This runs even if the app is killed/in the background.
 */
TaskManager.defineTask(GEOFENCE_TASK, async ({ data: { eventType, region }, error }) => {
  if (error) {
    console.error(`[Background] Geofence task error: ${error.message}`);
    return;
  }
  
  if (eventType === Location.GeofencingEventType.Enter) {
    console.log(`[Background] Entered zone: ${region.identifier}`);
    // Ideally we dispatch to the backend so Caregiver gets a push notification
    try {
      await safetyApi.createEmergency({
        type: 'geofence_enter', // Assuming backend accepts this as an info event
        location: { latitude: region.latitude, longitude: region.longitude }
      });
    } catch (e) {
      console.warn('Failed to sync zone entering', e);
    }

  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log(`[Background] Exited zone: ${region.identifier}`);
    // Critical: Dispatch emergency payload for leaving a safe zone
    try {
      await safetyApi.createEmergency({
        type: 'geofence_exit',
        location: { latitude: region.latitude, longitude: region.longitude }
      });
    } catch (e) {
      console.warn('Failed to sync zone exit', e);
    }
  }
});

/**
 * Service to manage geofencing regions locally on the OS.
 */
export const geofenceService = {
  
  /**
   * Registers an array of safe zones with the OS geofencing system.
   * Clears any previously registered regions first.
   * 
   * @param {import('../../types/safety').SafeZone[]} zones 
   * @returns {Promise<boolean>}
   */
  startMonitoringZones: async (zones) => {
    try {
      // Background location permission is strictly required for this
      const status = await checkPermission(PERMISSION_TYPES.LOCATION_BACKGROUND, false);
      if (status !== PERMISSION_STATUS.GRANTED) {
        throw new Error('Background location permission required for geofencing');
      }

      if (!zones || zones.length === 0) {
        await geofenceService.stopMonitoringAll();
        return true;
      }

      // Convert our domain SafeZone objects to Expo GeofencingRegions
      const regions = zones
        .filter(z => z.active)
        .map(zone => ({
          identifier: zone.id,
          latitude: zone.latitude,
          longitude: zone.longitude,
          radius: zone.radius,
          notifyOnEnter: true,
          notifyOnExit: true,
        }));

      // In Expo, starting geofences overwrites the previous ones registered to this task
      await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
      console.log(`Started geofencing ${regions.length} zones`);
      return true;

    } catch (error) {
      console.error('Failed to start geofencing:', error);
      return false;
    }
  },

  /**
   * Stops OS monitoring for all safe zones.
   */
  stopMonitoringAll: async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK);
      if (isRegistered) {
        await Location.stopGeofencingAsync(GEOFENCE_TASK);
        console.log('Stopped all OS geofencing');
      }
    } catch (error) {
      console.error('Failed to stop geofencing:', error);
    }
  }
};
