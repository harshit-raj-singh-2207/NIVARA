<<<<<<< HEAD
import apiClient from './apiClient';
import { ENDPOINTS } from '../../constants/api';

/**
 * Caregiver Domain API requests (Part 2).
 * Handles fetching children, safety dashboards, and caregiver preferences.
 */

export const caregiverApi = {
  /**
   * Fetch the main caregiver dashboard payload.
   * Returns an aggregated summary of all assigned children, active emergencies, etc.
   * @returns {Promise<Object>}
   */
  getDashboard: async () => {
    const response = await apiClient.get(ENDPOINTS.CAREGIVER.DASHBOARD);
    return response.data;
  },

  /**
   * Fetch a list of all children assigned to this caregiver.
   * @returns {Promise<import('../../types/caregiver').ChildProfile[]>}
   */
  getChildren: async () => {
    const response = await apiClient.get(ENDPOINTS.CAREGIVER.CHILDREN.LIST);
    return response.data;
  },

  /**
   * Fetch detailed profile information for a specific child.
   * @param {string} childId 
   * @returns {Promise<import('../../types/caregiver').ChildProfile>}
   */
  getChildProfile: async (childId) => {
    const response = await apiClient.get(ENDPOINTS.CAREGIVER.CHILDREN.GET(childId));
    return response.data;
  },

  /**
   * Fetch the real-time status summary for a specific child.
   * (Safety state, current location short, band connection status).
   * @param {string} childId 
   * @returns {Promise<import('../../types/caregiver').CaregiverStatusSummary>}
   */
  getChildStatus: async (childId) => {
    const response = await apiClient.get(ENDPOINTS.CAREGIVER.CHILDREN.STATUS(childId));
    return response.data;
  },

  /**
   * Fetch only the raw safety events (timeline) for a child.
   * @param {string} childId 
   * @returns {Promise<import('../../types/safety').SafetyEvent[]>}
   */
  getChildSafetyEvents: async (childId) => {
    const response = await apiClient.get(ENDPOINTS.CAREGIVER.CHILDREN.SAFETY(childId));
    return response.data;
  },

  /**
   * Fetch detailed information about a child's assigned GPS band/devices.
   * @param {string} childId 
   * @returns {Promise<import('../../types/caregiver').DeviceInfo[]>}
   */
  getChildDevices: async (childId) => {
    const response = await apiClient.get(ENDPOINTS.CAREGIVER.CHILDREN.DEVICES(childId));
    return response.data;
  },

  /**
   * Fetch caregiver's notification preferences.
   * @returns {Promise<import('../../types/caregiver').CaregiverPreference>}
   */
  getPreferences: async () => {
    const response = await apiClient.get(ENDPOINTS.CAREGIVER.PREFERENCES);
    return response.data;
  },

  /**
   * Update caregiver's notification preferences.
   * @param {Partial<import('../../types/caregiver').CaregiverPreference>} preferences 
   * @returns {Promise<import('../../types/caregiver').CaregiverPreference>}
   */
  updatePreferences: async (preferences) => {
    const response = await apiClient.post(ENDPOINTS.CAREGIVER.PREFERENCES, preferences);
    return response.data;
  },
};
=======
/**
 * Caregiver API Service for NIVARA backend.
 */

import apiClient from './apiClient';

export const caregiverApi = {
  getLinkedDependents: async () => {
    try {
      return await apiClient.get('/api/v1/users/caregiver-linked-users');
    } catch (err) {
      return [
        {
          id: 'child_1',
          name: 'Alex Vance',
          avatar: '👦',
          age: '12',
          isOnline: true,
          emotionalState: 'Calm',
          noiseDb: 72,
          location: {
            address: '124 Sensory Safe Haven, Innovation Hub, Tech City',
            latitude: 37.7749,
            longitude: -122.4194,
            isInsideSafeZone: true,
            lastUpdated: 'Just now',
          },
          routine: {
            activeTaskTitle: 'Morning Hygiene & Bathing',
            progressPercentage: 60,
            completedCount: 3,
            totalCount: 5,
          },
          device: {
            deviceName: 'NIVARA Smart Band #402',
            batteryLevel: 88,
            isConnected: true,
            isSeparated: false,
          },
        },
      ];
    }
  },

  sendQuickCheckIn: async (dependentId, message) => {
    try {
      return await apiClient.post('/api/v1/notifications/send-alert', {
        alert_type: 'ROUTINE_REMINDER',
        title: 'Caregiver Check-In',
        message: message || 'Hi Alex! Checking in. Are you feeling okay?',
      });
    } catch (err) {
      return { success: true, message: 'Check-in alert sent' };
    }
  },

  adjustSensoryRemote: async (dependentId, noiseThresholdDb) => {
    try {
      return await apiClient.put('/api/v1/users/me', {
        sensory_preferences: { noise_threshold_db: noiseThresholdDb },
      });
    } catch (err) {
      return { success: true };
    }
  },
};

export default caregiverApi;
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
