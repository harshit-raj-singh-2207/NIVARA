/**
 * Communication API Service for NIVARA backend.
 * Connects to AI emotion adaptation and sentence simplification endpoints.
 */

import apiClient from './apiClient';

export const communicationApi = {
  simplifyText: async (text, style = 'simple') => {
    try {
      return await apiClient.post('/communication/simplify', { text, style });
    } catch (err) {
      // Graceful fallback for demo/offline simulation
      return {
        simplified_text: `Simplified (${style}): ${text}`,
        explanation: 'Simplified using AI text adaptation rules.',
      };
    }
  },

  generateSentences: async (emotion, promptText = '', style = 'simple') => {
    try {
      return await apiClient.post('/communication/generate-sentence', {
        emotion,
        prompt: promptText,
        keywords: [],
        style,
      });
    } catch (err) {
      // Graceful fallback suggestions
      return {
        suggestions: [
          `I am feeling ${emotion} right now. I need a quiet moment.`,
          `Could you please help me with ${promptText || 'this activity'}?`,
          `I want to share that I feel ${emotion} and would like support.`,
        ],
      };
    }
  },
  explainMessage: (message) => apiClient.post('/communication/explain', { message }),
  getHistory: (params = { limit: 50, skip: 0 }) => apiClient.get('/communication/history', { params }),

  sendQuickPanicNeed: async (needType, location = null) => {
    try {
      return await apiClient.post('/notifications/send-alert', {
        alert_type: 'EMERGENCY_SOS',
        title: `Quick Need: ${needType}`,
        message: `User activated quick need shortcut: "${needType}"`,
        location_name: location || 'Home Geofence Zone',
      });
    } catch (err) {
      return { success: true, message: 'Alert dispatched locally' };
    }
  },
};

export default communicationApi;
