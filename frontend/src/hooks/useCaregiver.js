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
