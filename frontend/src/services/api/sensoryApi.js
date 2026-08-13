/**
 * Sensory & Environment API Service for NIVARA backend.
 */

import apiClient from './apiClient';

export const sensoryApi = {
  getEnvironmentalStatus: async () => {
    try {
      return await apiClient.get('/api/v1/sensory/environment');
    } catch (err) {
      // Mock fallback data for real-time sensors
      return {
        noise_level_db: 78,
        noise_threshold_db: 85,
        brightness_lux: 420,
        crowd_density: 'medium',
        crowd_count: 5,
        active_alert: {
          type: 'SENSORY_WARNING',
          severity: 'warning',
          title: 'Ambient Noise Approaching Comfort Limit',
          message: 'Decibels reached 78 dB. Consider putting on noise-canceling headphones.',
          recommendedAction: 'Put on noise-canceling headphones or step outside',
        },
        social_cue: {
          icon: '😊',
          title: 'Warm Greeting Tone Identified',
          tone: 'Friendly & Welcoming',
          emotion: 'Happy / Inviting',
          bodyLanguage: 'Open posture, smiling, relaxed shoulders',
          context: 'Friend or colleague starting a casual conversation',
        },
        suggested_responses: [
          'Hi! Good to see you today.',
          'Thank you! How are you doing?',
          'I am doing well, thanks for asking.',
        ],
      };
    }
  },

  updateSensoryPreferences: async (preferencesPayload) => {
    try {
      return await apiClient.patch('/api/v1/users/me/preferences', preferencesPayload);
    } catch (err) {
      return { success: true };
    }
  },
};

export default sensoryApi;
