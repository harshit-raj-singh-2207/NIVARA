<<<<<<< HEAD
import { useSafetyStore } from '../../store/safetyStore';
import { safetyApi } from '../api/safetyApi';

/**
 * Parses and handles incoming characteristic notifications from the BLE Band.
 * Translates raw base64 or byte arrays into domain logic.
 */
export const bandEvents = {
  
  /**
   * Decodes a standard BLE Battery Level characteristic (0x2A19).
   * 
   * @param {string} deviceId 
   * @param {string} base64Value 
   */
  handleBatteryLevelUpdate: (deviceId, base64Value) => {
    try {
      // Decode base64 to byte array
      const binaryString = atob(base64Value);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Battery level is usually a single uint8 from 0 to 100
      const batteryLevel = bytes[0];
      
      console.log(`Band Battery Level updated: ${batteryLevel}%`);

      // Update local state
      useSafetyStore.getState().updateBandStatus({ batteryLevel });

      // Sync to backend occasionally so caregiver can see it
      // In a real app, you might throttle this so it doesn't spam the API on every 1% drop
      if (batteryLevel % 10 === 0 || batteryLevel < 20) {
        safetyApi.updateBandStatus(deviceId, { batteryLevel }).catch(console.warn);
      }

    } catch (error) {
      console.warn('Failed to parse battery level from band', error);
    }
  },

  /**
   * Helper to decode arbitrary UTF-8 text sent from the band.
   * Useful if the band sends string-based commands (e.g., 'HELP') instead of flags.
   * 
   * @param {string} base64Value 
   * @returns {string} Decode string
   */
  decodeStringPayload: (base64Value) => {
    try {
      const binaryString = atob(base64Value);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(bytes);
    } catch {
      return '';
    }
  }

=======
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
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
};
