<<<<<<< HEAD
import { useEffect, useState, useCallback, useRef } from 'react';
import { locationService } from '../services/location/locationService';
import { useSafetyStore } from '../store/safetyStore';

/**
 * Custom hook to manage foreground location tracking in React components.
 * Bridges the gap between the native `locationService` and the Zustand global store.
 * Automatically cleans up listeners on unmount.
 */
export const useLocation = () => {
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Keep track of the subscription ref so we can remove it
  const subscriptionRef = useRef(null);

  // Pull actions and state from our global store
  const { 
    currentLocation, 
    setCurrentLocation, 
    isTrackingActive, 
    setTrackingActive 
  } = useSafetyStore();

  /**
   * Fetches the user's current location once, bypassing state loops.
   * Useful for "Center on Me" buttons.
   */
  const getSingleFix = useCallback(async () => {
    setIsInitializing(true);
    setError(null);
    try {
      const loc = await locationService.getCurrentLocation();
      if (loc) {
        setCurrentLocation(loc);
      }
      return loc;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [setCurrentLocation]);

  /**
   * Starts a continuous, high-accuracy foreground location subscription.
   * Ideal for map views when the user is looking at the screen.
   */
  const startTracking = useCallback(async () => {
    if (subscriptionRef.current) return; // Already tracking
    
    setError(null);
    try {
      setTrackingActive(true);
      
      const sub = await locationService.startForegroundTracking((newLocation) => {
        setCurrentLocation(newLocation);
      });
      
      subscriptionRef.current = sub;
    } catch (err) {
      setError(err.message);
      setTrackingActive(false);
    }
  }, [setCurrentLocation, setTrackingActive]);

  /**
   * Stops the continuous foreground subscription.
   */
  const stopTracking = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setTrackingActive(false);
  }, [setTrackingActive]);

  /**
   * Convenience wrapper for reverse geocoding the *current* location.
   */
  const getCurrentAddress = useCallback(async () => {
    if (!currentLocation) return null;
    try {
      return await locationService.getAddressFromCoords(
        currentLocation.latitude, 
        currentLocation.longitude
      );
    } catch (err) {
      console.warn('Geocoding failed inside hook', err);
      return null;
    }
  }, [currentLocation]);

  // Clean up the subscription when the component using this hook unmounts
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
        setTrackingActive(false);
      }
    };
  }, [setTrackingActive]);

  return {
    location: currentLocation,
    isTrackingActive,
    isInitializing,
    error,
    startTracking,
    stopTracking,
    getSingleFix,
    getCurrentAddress
  };
};
=======
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
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
