/**
 * Custom React Hook: useSafety
 * Connects UI components to useSafetyStore for GPS coordinates, safe zones, BLE smart band state, and Emergency SOS alert dispatch.
 */

import { useEffect, useCallback } from 'react';
import useSafetyStore from '../store/safetyStore';

export const useSafety = () => {
  const {
    location,
    bandState,
    safeZones,
    emergencyContacts,
    isSosTriggered,
    isLoading,
    error,
    fetchSafetyOverview,
    triggerEmergencySOS,
    updateLocation,
  } = useSafetyStore();

  useEffect(() => {
    fetchSafetyOverview();
  }, [fetchSafetyOverview]);

  const handleTriggerSOS = useCallback(async () => {
    await triggerEmergencySOS();
  }, [triggerEmergencySOS]);

  return {
    location,
    bandState,
    safeZones,
    emergencyContacts,
    isSosTriggered,
    isLoading,
    error,
    refreshSafetyOverview: fetchSafetyOverview,
    triggerEmergencySOS: handleTriggerSOS,
    updateLocation,
  };
};

export default useSafety;
