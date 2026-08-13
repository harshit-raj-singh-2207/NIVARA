<<<<<<< HEAD
import { useCallback, useState } from 'react';
import { useCaregiverStore } from '../store/caregiverStore';

/**
 * Custom React hook for Caregiver UI components.
 * Bridges UI to the Caregiver Zustand store.
 */
export const useCaregiver = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState(null);

  const {
    dashboardSummary,
    selectedChildId,
    selectedChildStatus,
    selectedChildEvents,
    preferences,
    isLoading: storeLoading,
    error: storeError,
    fetchDashboard,
    fetchChildDetail,
    setSelectedChildId,
    fetchPreferences,
    updatePreferences: baseUpdatePreferences
  } = useCaregiverStore();

  /**
   * Wrapper for fetching the main dashboard aggregator.
   */
  const loadDashboard = useCallback(async () => {
    await fetchDashboard();
  }, [fetchDashboard]);

  /**
   * Drill-down handler. Sets the active context and fetches deep details.
   */
  const selectChild = useCallback(async (childId) => {
    setSelectedChildId(childId);
    await fetchChildDetail(childId);
  }, [setSelectedChildId, fetchChildDetail]);

  /**
   * Wrapper for updating notification routing preferences with built-in loading state.
   */
  const updateRoutingPreferences = useCallback(async (updates) => {
    setIsUpdating(true);
    setActionError(null);
    try {
      const success = await baseUpdatePreferences(updates);
      if (!success) {
        setActionError('Failed to update preferences');
      }
      return success;
    } catch (err) {
      setActionError(err.message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [baseUpdatePreferences]);

  return {
    // State
    dashboardSummary,
    selectedChildId,
    selectedChildStatus,
    selectedChildEvents,
    preferences,
    
    // Loading/Error states
    isLoading: storeLoading || isUpdating,
    error: storeError || actionError,

    // Actions
    loadDashboard,
    selectChild,
    fetchChildDetail,
    
    // Preferences
    loadPreferences: fetchPreferences,
    updateRoutingPreferences
  };
};
=======
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
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
