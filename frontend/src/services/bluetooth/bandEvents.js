/**
 * bandEvents.js
 * Hardware event handlers for NIVARA Smart GPS Band.
 * Processes physical separation warnings and hardware SOS button press events.
 */

import useSafetyStore from '../../store/safetyStore';
import safetyApi from '../api/safetyApi';

export const handleBandSeparation = async (rssi, locationData) => {
  console.warn(`⚠️ Smart Band Physical Separation Detected! RSSI: ${rssi} dBm`);

  // Update safety store state for separation warning
  const currentBandState = useSafetyStore.getState().bandState;
  useSafetyStore.setState({
    bandState: {
      ...currentBandState,
      isSeparated: true,
      signalStrength: rssi,
    },
  });

  // Dispatch location payload update to backend
  try {
    await safetyApi.triggerSOSAlert({
      address: locationData?.address || 'Physical Separation Location',
      latitude: locationData?.latitude || 37.7749,
      longitude: locationData?.longitude || -122.4194,
      message: `BAND SEPARATION ALERT: Phone-to-band distance exceeded threshold (RSSI ${rssi} dBm).`,
    });
  } catch (err) {
    console.warn('Failed to dispatch band separation alert to backend:', err);
  }
};

export const handleHardwareSOSTrigger = async (sosData = {}) => {
  console.log('🚨 HARDWARE SOS BUTTON PRESSED ON SMART BAND!');

  // Instantly trigger priority emergency alert in safetyStore
  try {
    await useSafetyStore.getState().triggerEmergencySOS();
  } catch (err) {
    console.warn('Error processing hardware SOS event:', err);
  }
};

export default {
  handleBandSeparation,
  handleHardwareSOSTrigger,
};
