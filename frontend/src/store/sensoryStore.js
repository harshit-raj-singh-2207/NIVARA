/**
 * Sensory Zustand Store for NIVARA frontend.
 * Manages environmental sensor telemetry (noise dB, brightness lux, crowd density), sensory sensitivity thresholds, overload alerts, and social cue analysis.
 */

import { create } from 'zustand';
import sensoryApi from '../services/api/sensoryApi';

export const useSensoryStore = create((set, get) => ({
  noiseLevelDb: 78,
  noiseThresholdDb: 85,
  brightnessLux: 420,
  brightnessThresholdLux: 800,
  crowdDensity: 'medium',
  crowdCount: 5,
  activeAlert: {
    type: 'SENSORY_WARNING',
    severity: 'warning',
    title: 'Ambient Noise Approaching Comfort Limit',
    message: 'Decibels reached 78 dB. Consider putting on noise-canceling headphones.',
    recommendedAction: 'Put on noise-canceling headphones or step outside',
  },
  socialCue: {
    icon: '😊',
    title: 'Warm Greeting Tone Identified',
    tone: 'Friendly & Welcoming',
    emotion: 'Happy / Inviting',
    bodyLanguage: 'Open posture, smiling, relaxed shoulders',
    context: 'Friend or colleague starting a casual conversation',
  },
  suggestedResponses: [
    'Hi! Good to see you today.',
    'Thank you! How are you doing?',
    'I am doing well, thanks for asking.',
  ],
  isLoading: false,
  error: null,

  dismissAlert: () => set({ activeAlert: null }),
  setNoiseThreshold: (newDb) => set({ noiseThresholdDb: newDb }),
  setBrightnessThreshold: (newLux) => set({ brightnessThresholdLux: newLux }),

  fetchEnvironmentalStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await sensoryApi.getEnvironmentalStatus();
      set({
        noiseLevelDb: data.noise_level_db ?? 78,
        noiseThresholdDb: data.noise_threshold_db ?? 85,
        brightnessLux: data.brightness_lux ?? 420,
        crowdDensity: data.crowd_density ?? 'medium',
        crowdCount: data.crowd_count ?? 5,
        activeAlert: data.active_alert || null,
        socialCue: data.social_cue || null,
        suggestedResponses: data.suggested_responses || [],
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  updateSensoryThresholds: async (noiseDb, brightnessLux) => {
    set({ noiseThresholdDb: noiseDb, brightnessThresholdLux: brightnessLux });
    try {
      await sensoryApi.updateSensoryPreferences({
        noise_threshold_db: noiseDb,
        brightness_threshold_lux: brightnessLux,
      });
    } catch (err) {
      console.warn('Failed to sync sensory thresholds:', err);
    }
  },

  // Simulates sensor telemetry updates for polling demo
  simulateSensorTick: () => {
    const { noiseLevelDb, brightnessLux } = get();
    const noiseVariance = (Math.random() - 0.5) * 6;
    const brightnessVariance = (Math.random() - 0.5) * 40;
    const newDb = Math.round(Math.max(40, Math.min(115, noiseLevelDb + noiseVariance)));
    const newLux = Math.round(Math.max(100, Math.min(1200, brightnessLux + brightnessVariance)));
    set({ noiseLevelDb: newDb, brightnessLux: newLux });
  },
}));

export default useSensoryStore;
