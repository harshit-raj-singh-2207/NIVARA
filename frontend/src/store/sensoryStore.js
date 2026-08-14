import { create } from 'zustand';

export const useSensoryStore = create((set, get) => ({
  noiseLevelDb: 42, // decibels
  brightnessLux: 350, // lux
  crowdDensity: 'MODERATE', // LOW, MODERATE, HIGH
  sensoryAlert: null, // { type: 'NOISE_WARNING', message: 'High noise environment detected (78 dB)' }
  preferences: {
    noiseAlertThresholdDb: 70,
    brightnessThresholdLux: 800,
    enableSensoryVibration: true,
    soothingSoundtrack: 'Gentle Ocean Waves',
  },
  socialCues: [
    { id: 'sc_1', title: 'Crossed Arms', meaning: 'The person might feel closed off, defensive, or cold.', suggestion: 'Give them space and speak gently.' },
    { id: 'sc_2', title: 'Eye Contact Avoidance', meaning: 'The person might be feeling overwhelmed or shy.', suggestion: 'Do not force eye contact; use calm posture.' },
    { id: 'sc_3', title: 'Smiling with Nod', meaning: 'The person agrees or understands what you are saying.', suggestion: 'Continue speaking or give a friendly nod back.' },
  ],

  updateEnvironment: (data) => set(state => {
    const noise = data.noiseLevelDb ?? state.noiseLevelDb;
    let alert = null;
    if (noise > state.preferences.noiseAlertThresholdDb) {
      alert = {
        id: `alt_${Date.now()}`,
        type: 'NOISE_WARNING',
        message: `High noise detected: ${noise} dB. Consider wearing headphones.`,
        level: 'WARNING',
      };
    }
    return {
      noiseLevelDb: noise,
      brightnessLux: data.brightnessLux ?? state.brightnessLux,
      crowdDensity: data.crowdDensity ?? state.crowdDensity,
      sensoryAlert: alert || state.sensoryAlert,
    };
  }),

  dismissAlert: () => set({ sensoryAlert: null }),

  updatePreferences: (newPrefs) => set(state => ({
    preferences: { ...state.preferences, ...newPrefs }
  }))
}));

export default useSensoryStore;
