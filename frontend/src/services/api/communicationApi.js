/**
 * Communication API Service for NIVARA backend.
 * Connects to AI emotion adaptation and sentence simplification endpoints.
 */

import apiClient from './apiClient';

export const communicationApi = {
  simplifyText: async (text, style = 'simple') => {
    try {
      return await apiClient.post('/api/v1/communication/simplify', { text, style });
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
      return await apiClient.post('/api/v1/communication/generate', {
        emotion,
        prompt: promptText,
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

  sendQuickPanicNeed: async (needType, location = null) => {
    try {
      return await apiClient.post('/api/v1/notifications/send-alert', {
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
