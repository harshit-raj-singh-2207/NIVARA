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
