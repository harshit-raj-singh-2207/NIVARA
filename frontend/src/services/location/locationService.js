import * as Location from 'expo-location';
import { checkPermission } from '../../utils/permissionUtils';
import { PERMISSION_TYPES, PERMISSION_STATUS } from '../../constants/permissions';
import { LOCATION_CONFIG } from '../../constants/config';
import { formatExpoLocation } from '../../utils/locationUtils';

/**
 * Service to handle foreground location tracking and one-off GPS fixes.
 * Background tracking is registered separately in backgroundLocation.js
 */

export const locationService = {
  
  /**
   * Gets a single, highly-accurate GPS fix.
   * Useful for SOS payload attachment or centering a map immediately.
   * 
   * @returns {Promise<import('../../types/safety').LocationRecord | null>}
   */
  getCurrentLocation: async () => {
    try {
      const status = await checkPermission(PERMISSION_TYPES.LOCATION_FOREGROUND, false);
      if (status !== PERMISSION_STATUS.GRANTED) {
        throw new Error('Location permission not granted');
      }

      // get getCurrentPositionAsync is heavy, so we set accuracy to High
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return formatExpoLocation(location, 'phone');
    } catch (error) {
      console.warn('Failed to get current location:', error);
      return null;
    }
  },

  /**
   * Reverse geocodes coordinates to a human-readable address.
   * 
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Promise<Object | null>}
   */
  getAddressFromCoords: async (latitude, longitude) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (results && results.length > 0) {
        return results[0]; // Returns { street, city, region, country, postalCode, name }
      }
      return null;
    } catch (error) {
      console.warn('Failed to reverse geocode:', error);
      return null;
    }
  },

  /**
   * Starts a foreground subscription to location changes.
   * Useful for live map views when the app is open.
   * 
   * @param {Function} onLocationChange - Callback fired with the cleaned LocationRecord
   * @returns {Promise<Object>} Subscription object with a `.remove()` method
   */
  startForegroundTracking: async (onLocationChange) => {
    const status = await checkPermission(PERMISSION_TYPES.LOCATION_FOREGROUND, false);
    if (status !== PERMISSION_STATUS.GRANTED) {
      throw new Error('Foreground location permission not granted');
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: LOCATION_CONFIG.timeInterval,
        distanceInterval: LOCATION_CONFIG.distanceInterval,
      },
      (location) => {
        onLocationChange(formatExpoLocation(location, 'phone'));
      }
    );

    return subscription; // The caller must call subscription.remove() when unmounting
  },

  /**
   * Starts tracking compass heading.
   * 
   * @param {Function} onHeadingChange 
   * @returns {Promise<Object>} Subscription object
   */
  startHeadingTracking: async (onHeadingChange) => {
    const subscription = await Location.watchHeadingAsync((headingData) => {
      onHeadingChange(headingData.trueHeading || headingData.magHeading);
    });
    return subscription;
  }
};
