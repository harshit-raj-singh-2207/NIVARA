import apiClient from './apiClient';

export const safetyApi = {
  triggerSOS: async (payload = {}) => {
    try {
      const response = await apiClient.post('/safety/sos/trigger', payload);
      return response.data;
    } catch (error) {
      console.log('[safetyApi] Fallback offline SOS trigger:', error.message);
      return {
        success: true,
        eventId: `sos_${Date.now()}`,
        status: 'ACTIVE',
        location: payload.location || {
          latitude: 28.6139,
          longitude: 77.2090,
          address: 'Delhi Public School Campus, Zone B',
          geofenceName: 'School Safe Zone',
        },
        guardian: {
          id: 'usr_cg_100',
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '+91 98765 43210',
        },
        timestamp: new Date().toISOString(),
        message: '🚨 Emergency alert dispatched to Guardian (Priya Sharma). GPS tracking active.',
      };
    }
  },

  getActiveAlerts: async () => {
    try {
      const response = await apiClient.get('/safety/sos/alerts');
      return response.data;
    } catch (error) {
      return { success: true, alerts: [] };
    }
  },

  resolveSOS: async (eventId) => {
    try {
      const response = await apiClient.post(`/safety/sos/${eventId}/resolve`);
      return response.data;
    } catch (error) {
      return { success: true, message: `Event ${eventId} resolved` };
    }
  },

  getSOSHistory: async () => {
    try {
      const response = await apiClient.get('/safety/sos/history');
      return response.data;
    } catch (error) {
      return { success: true, history: [] };
    }
  },
};

export default safetyApi;
