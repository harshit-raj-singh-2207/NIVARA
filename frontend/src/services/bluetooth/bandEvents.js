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

};
