/**
 * Custom React Hook: useLocation
 * Subscribes to live GPS position updates, tracks coordinates, address, and safe zone proximity using locationService and safetyStore.
 */

import { useEffect, useState, useCallback } from 'react';
import useSafetyStore from '../store/safetyStore';
import locationService from '../services/location/locationService';
import geofenceService from '../services/location/geofenceService';
import { isPointInGeofence } from '../utils/locationUtils';

export const useLocation = () => {
  const { location, safeZones, updateLocation } = useSafetyStore();
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Refreshes current GPS position and checks safe zone proximity.
   */
  const refreshLocation = useCallback(async () => {
    try {
      const currentLocation = await locationService.getCurrentLocation();
      if (currentLocation) {
        let isInsideAnyZone = false;
        safeZones.forEach((zone) => {
          if (
            isPointInGeofence(
              currentLocation.latitude,
              currentLocation.longitude,
              zone.centerLatitude || zone.latitude || 37.7749,
              zone.centerLongitude || zone.longitude || -122.4194,
              zone.radiusMeters || 500
            )
          ) {
            isInsideAnyZone = true;
          }
        });

        const updatedLoc = {
          ...currentLocation,
          isInsideSafeZone: isInsideAnyZone,
        };

        updateLocation(updatedLoc);
        return updatedLoc;
      }
    } catch (err) {
      setError(err.message);
    }
  }, [safeZones, updateLocation]);

  useEffect(() => {
    let subscription = null;
    let isMounted = true;

    const startWatching = async () => {
      setIsTracking(true);
      subscription = await locationService.watchLocation((newLoc) => {
        if (isMounted && newLoc) {
          updateLocation(newLoc);
        }
      });
    };

    startWatching();

    return () => {
      isMounted = false;
      if (subscription && subscription.remove) {
        subscription.remove();
      }
      locationService.stopWatchLocation();
    };
  }, [updateLocation]);

  return {
    location,
    safeZones,
    isTracking,
    error,
    refreshLocation,
  };
};

export default useLocation;
