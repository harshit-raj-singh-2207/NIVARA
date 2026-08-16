import { useCallback, useState } from 'react';
import { useSafetyStore } from '../store/safetyStore';
import { safetyApi } from '../services/api/safetyApi';

/**
 * Custom React hook for UI components to interact with the broader Safety Module.
 * Wraps Zustand state and API calls for contacts, events, and emergency management.
 */
export const useSafety = () => {
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Expose specific slices of the global store to the UI
  const {
    activeEmergency,
    emergencyCountdown,
    events,
    contacts,
    isLoading: storeLoading,
    error: storeError,
    triggerEmergency,
    resolveEmergency,
    startSosCountdown,
    cancelSosCountdown,
    refreshEvents,
  } = useSafetyStore();

  /**
   * Wrapper for fetching/refreshing all initial safety data.
   */
  const loadDashboardData = useCallback(async () => {
    await useSafetyStore.getState().fetchInitialData();
  }, []);

  /**
   * Emergency Contacts Management
   */
  const addContact = useCallback(async (contactData) => {
    setIsFetchingInfo(true);
    setActionError(null);
    try {
      const newContact = await safetyApi.createContact(contactData);
      
      // Update global store directly so the UI re-renders
      useSafetyStore.setState(state => ({
        contacts: [...state.contacts, newContact]
      }));
      return true;
    } catch (err) {
      setActionError(err.message);
      return false;
    } finally {
      setIsFetchingInfo(false);
    }
  }, []);

  const removeContact = useCallback(async (contactId) => {
    setIsFetchingInfo(true);
    setActionError(null);
    try {
      await safetyApi.deleteContact(contactId);
      
      useSafetyStore.setState(state => ({
        contacts: state.contacts.filter(c => c.id !== contactId)
      }));
      return true;
    } catch (err) {
      setActionError(err.message);
      return false;
    } finally {
      setIsFetchingInfo(false);
    }
  }, []);

  /**
   * False Alarm Management
   */
  const cancelActiveEmergency = useCallback(async () => {
    if (!activeEmergency) return;
    setIsFetchingInfo(true);
    try {
      await safetyApi.cancelEmergency(activeEmergency.id);
      useSafetyStore.setState({ activeEmergency: null });
      await refreshEvents();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsFetchingInfo(false);
    }
  }, [activeEmergency, refreshEvents]);

  return {
    // State
    activeEmergency,
    isEmergencyActive: !!activeEmergency,
    emergencyCountdown,
    events,
    contacts,
    
    // Loading/Error states
    isLoading: storeLoading || isFetchingInfo,
    error: storeError || actionError,

    // Core Actions
    loadDashboardData,
    triggerEmergency,
    resolveEmergency,
    cancelActiveEmergency,
    
    // Countdown Actions (for the physical UI SOS button)
    startSosCountdown,
    cancelSosCountdown,
    
    // Secondary Actions
    refreshEvents,
    addContact,
    removeContact,
  };
};
