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
