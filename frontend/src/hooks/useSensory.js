/**
 * Custom React Hook: useSensory
 * Connects UI components to useSensoryStore for environmental sensor telemetry (noise dB, brightness lux, crowd density), sensory overload alerts, and social cue analysis.
 */

import { useEffect, useCallback } from 'react';
import useSensoryStore from '../store/sensoryStore';

export const useSensory = (autoPoll = false) => {
  const {
    noiseLevelDb,
    noiseThresholdDb,
    brightnessLux,
    brightnessThresholdLux,
    crowdDensity,
    crowdCount,
    activeAlert,
    socialCue,
    suggestedResponses,
    isLoading,
    error,
    dismissAlert,
    setNoiseThreshold,
    setBrightnessThreshold,
    fetchEnvironmentalStatus,
    updateSensoryThresholds,
    simulateSensorTick,
  } = useSensoryStore();

  useEffect(() => {
    fetchEnvironmentalStatus();
  }, [fetchEnvironmentalStatus]);

  useEffect(() => {
    if (!autoPoll) return;
    const interval = setInterval(() => {
      simulateSensorTick();
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPoll, simulateSensorTick]);

  const handleUpdateThresholds = useCallback(
    async (noiseDb, brightnessLux) => {
      await updateSensoryThresholds(noiseDb, brightnessLux);
    },
    [updateSensoryThresholds]
  );

  return {
    noiseLevelDb,
    noiseThresholdDb,
    brightnessLux,
    brightnessThresholdLux,
    crowdDensity,
    crowdCount,
    activeAlert,
    socialCue,
    suggestedResponses,
    isLoading,
    error,
    dismissAlert,
    setNoiseThreshold,
    setBrightnessThreshold,
    refreshSensoryStatus: fetchEnvironmentalStatus,
    updateSensoryThresholds: handleUpdateThresholds,
  };
};

export default useSensory;
