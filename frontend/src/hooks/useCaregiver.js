/**
 * Custom React Hook: useCaregiver
 * Connects caregiver dashboard UI components to useCaregiverStore for dependent tracking, status summaries, check-ins, and emergency alert responses.
 */

import { useEffect, useCallback } from 'react';
import useCaregiverStore from '../store/caregiverStore';

export const useCaregiver = () => {
  const {
    dependents,
    activeDependentId,
    activeEmergencyAlert,
    isLoading,
    error,
    setActiveDependentId,
    dismissEmergencyAlert,
    fetchCaregiverDashboard,
    sendCheckIn,
    adjustSensoryLimit,
    simulateEmergencyAlert,
  } = useCaregiverStore();

  useEffect(() => {
    fetchCaregiverDashboard();
  }, [fetchCaregiverDashboard]);

  const activeDependent = dependents.find((d) => d.id === activeDependentId) || dependents[0];

  const handleSendCheckIn = useCallback(
    async (message) => {
      await sendCheckIn(message);
    },
    [sendCheckIn]
  );

  const handleAdjustSensoryLimit = useCallback(
    async (newDb) => {
      await adjustSensoryLimit(newDb);
    },
    [adjustSensoryLimit]
  );

  return {
    dependents,
    activeDependent,
    activeDependentId,
    activeEmergencyAlert,
    isLoading,
    error,
    setActiveDependentId,
    dismissEmergencyAlert,
    refreshCaregiverDashboard: fetchCaregiverDashboard,
    sendCheckIn: handleSendCheckIn,
    adjustSensoryLimit: handleAdjustSensoryLimit,
    simulateEmergencyAlert,
  };
};

export default useCaregiver;
