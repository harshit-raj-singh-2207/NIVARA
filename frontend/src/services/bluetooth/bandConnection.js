import { bluetoothService } from './bluetoothService';
import { useSafetyStore } from '../../store/safetyStore';
import { safetyApi } from '../api/safetyApi';
import { BLUETOOTH_CONFIG } from '../../constants/config';
import { BandConnectionStatus, EmergencyType } from '../../types/safety';

let reconnectTimeout = null;
let reconnectAttempts = 0;

/**
 * Higher-level orchestration for the GPS band.
 * Sits between the raw bluetoothService and the UI/Global State (Zustand).
 * Handles auto-reconnection loops and dispatching separation alerts to the backend.
 */
export const bandConnection = {

  /**
   * Connects to a band and sets up all listeners, updating global state.
   * @param {string} deviceId 
   */
  startConnection: async (deviceId) => {
    const setStatus = useSafetyStore.getState().updateBandStatus;
    
    try {
      setStatus({ 
        connectionState: BandConnectionStatus.CONNECTING,
        deviceId 
      });

      // 1. Connect via raw BLE service
      const device = await bluetoothService.connect(deviceId, bandConnection.handleDisconnect);
      
      // 2. Reset reconnect counters
      reconnectAttempts = 0;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);

      // 3. Update global store
      setStatus({
        isConnected: true,
        connectionState: BandConnectionStatus.CONNECTED,
        lastSeen: new Date().toISOString()
      });

      // 4. Register with backend (sets device as 'active' for this user session)
      await safetyApi.updateBandStatus(deviceId, { connectionStatus: 'connected' }).catch(console.warn);

      // 5. Start monitoring characteristics (SOS button, battery level, etc)
      // Note: UUIDs depend on the actual hardware model 
      const SERVICE_UUID = BLUETOOTH_CONFIG.bandServiceUUID;
      const SOS_CHAR = '00002a24-0000-1000-8000-00805f9b34fb'; // Example characteristic

      bluetoothService.monitorSosButton(deviceId, SERVICE_UUID, SOS_CHAR, bandConnection.handleBandSos);

    } catch (error) {
      console.error('Connection orchestration failed:', error);
      setStatus({ 
        isConnected: false, 
        connectionState: BandConnectionStatus.DISCONNECTED 
      });
    }
  },

  /**
   * Called internally when the raw BLE service detects a disconnection.
   * @param {Error} error 
   * @param {Object} device 
   */
  handleDisconnect: async (error, device) => {
    const setStatus = useSafetyStore.getState().updateBandStatus;
    
    setStatus({ 
      isConnected: false, 
      connectionState: BandConnectionStatus.DISCONNECTED 
    });

    console.warn(`Band disconnected unexpectedly: ${device?.id}`);

    // Update backend (inform caregiver UI that band is offline)
    if (device?.id) {
      await safetyApi.updateBandStatus(device.id, { connectionStatus: 'disconnected' }).catch(console.warn);
    }

    // Trigger auto-reconnect loop
    bandConnection.attemptReconnect(device?.id);
  },

  /**
   * Attempts to reconnect to the band seamlessly.
   * If it fails too many times, it triggers a Separation Alert.
   * @param {string} deviceId 
   */
  attemptReconnect: (deviceId) => {
    if (!deviceId) return;

    if (reconnectAttempts < BLUETOOTH_CONFIG.maxReconnectAttempts) {
      reconnectAttempts++;
      console.log(`Auto-reconnect attempt ${reconnectAttempts}/${BLUETOOTH_CONFIG.maxReconnectAttempts}...`);
      
      useSafetyStore.getState().updateBandStatus({ 
        connectionState: BandConnectionStatus.CONNECTING 
      });

      reconnectTimeout = setTimeout(() => {
        bandConnection.startConnection(deviceId);
      }, BLUETOOTH_CONFIG.reconnectDelay);
      
    } else {
      console.error('Max reconnect attempts reached. Band is considered SEPARATED.');
      bandConnection.triggerSeparationAlert();
    }
  },

  /**
   * Triggers a critical alert to the backend indicating the child has wandered
   * away from the phone (or the band battery died).
   */
  triggerSeparationAlert: async () => {
    const currentLocation = useSafetyStore.getState().currentLocation;
    
    try {
      await safetyApi.createEmergency({
        type: EmergencyType.SEPARATION,
        location: currentLocation
      });
      // Caregiver will now receive a huge push notification
    } catch (error) {
      console.error('Failed to trigger separation alert!', error);
    }
  },

  /**
   * Fired when the child holds the physical panic button on the GPS band.
   */
  handleBandSos: async () => {
    console.log('SOS BUTTON PRESSED ON WEARABLE BAND!');
    const currentLocation = useSafetyStore.getState().currentLocation;
    
    try {
      await safetyApi.createEmergency({
        type: EmergencyType.BAND_SOS,
        location: currentLocation
      });
    } catch (error) {
      console.error('Failed to dispatch Band SOS alert to backend', error);
    }
  },

  /**
   * Manual disconnect triggered by user via UI.
   * Cleans up listeners and stops auto-reconnect.
   */
  stopConnection: async (deviceId) => {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    reconnectAttempts = BLUETOOTH_CONFIG.maxReconnectAttempts; // Prevent auto-reconnect

    await bluetoothService.disconnect(deviceId);
    
    useSafetyStore.getState().updateBandStatus({ 
      isConnected: false, 
      connectionState: BandConnectionStatus.DISCONNECTED,
      deviceId: null 
    });
  }
};
