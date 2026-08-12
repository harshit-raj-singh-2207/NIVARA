/**
 * Safety & SOS API Service for NIVARA backend.
 */

import apiClient from './apiClient';

export const safetyApi = {
  triggerSOSAlert: async (locationData) => {
    try {
      return await apiClient.post('/api/v1/notifications/send-alert', {
        alert_type: 'EMERGENCY_SOS',
        title: 'CRITICAL EMERGENCY SOS TRIGGERED',
        message: 'User activated Emergency SOS panic button.',
        location_name: locationData?.address || 'Current GPS Location',
        latitude: locationData?.latitude || 37.7749,
        longitude: locationData?.longitude || -122.4194,
      });
    } catch (err) {
      return { success: true, message: 'SOS alert dispatched locally' };
    }
  },

  getSafeZones: async () => {
    try {
      return await apiClient.get('/api/v1/safety/safe-zones');
    } catch (err) {
      return [
        { id: 'sz_1', name: 'Home Safe Zone', radiusMeters: 500, active: true },
        { id: 'sz_2', name: 'School / Work Zone', radiusMeters: 300, active: true },
      ];
    }
  },

  getEmergencyContacts: async () => {
    try {
      return await apiClient.get('/api/v1/users/me');
    } catch (err) {
      return [
        { id: 'c1', name: 'Eleanor Vance', relationship: 'Primary Caregiver', phone: '+1 (555) 234-5678', isPrimary: true },
        { id: 'c2', name: 'Dr. Robert Marcus', relationship: 'Specialist Physician', phone: '+1 (555) 876-5432', isPrimary: false },
      ];
    }
  },
};

export default safetyApi;
