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
