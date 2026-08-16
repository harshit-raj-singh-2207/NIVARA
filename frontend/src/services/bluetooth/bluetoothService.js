import { Platform } from 'react-native';
import { BleManager, LogLevel } from 'react-native-ble-plx';
import { BLUETOOTH_CONFIG } from '../../constants/config';
import { BandConnectionStatus } from '../../types/safety';

/**
 * Service to manage Bluetooth Low Energy (BLE) connections to the GPS Band.
 * Note: react-native-ble-plx requires building a custom dev client. It will NOT work in Expo Go.
 */

// Singleton manager instance
let manager = null;

export const bluetoothService = {
  
  /**
   * Initializes the BLE manager if it hasn't been already.
   */
  init: () => {
    if (!manager) {
      manager = new BleManager();
      if (__DEV__) {
        manager.setLogLevel(LogLevel.Verbose);
      }
    }
  },

  /**
   * Cleans up the BLE manager. Should be called on unmount of the main app or logout.
   */
  destroy: () => {
    if (manager) {
      manager.destroy();
      manager = null;
    }
  },

  /**
   * Starts scanning for BLE devices.
   * 
   * @param {Function} onDeviceFound Callback when a device is discovered
   * @param {Function} onError Callback if scanning fails (e.g., BT off, no permissions)
   */
  startScan: async (onDeviceFound, onError) => {
    bluetoothService.init();

    // Check BLE state before scanning
    const state = await manager.state();
    if (state !== 'PoweredOn') {
      onError(new Error(`Bluetooth is ${state}. Please turn it on.`));
      return;
    }

    try {
      manager.startDeviceScan(
        null, // Scan for all devices (or pass [BLUETOOTH_CONFIG.bandServiceUUID] to filter)
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error('BLE Scan Error:', error);
            manager.stopDeviceScan();
            if (onError) onError(error);
            return;
          }

          // Filter by name prefix if desired, or let the UI handle it
          if (device && device.name) {
            onDeviceFound(device);
          }
        }
      );

      // Auto-stop scan after configured duration to save battery
      setTimeout(() => {
        manager.stopDeviceScan();
      }, BLUETOOTH_CONFIG.scanDuration * 1000);

    } catch (e) {
      if (onError) onError(e);
    }
  },

  /**
   * Stops an active scan.
   */
  stopScan: () => {
    if (manager) {
      manager.stopDeviceScan();
    }
  },

  /**
   * Connects to a specific BLE device by its ID (MAC address on Android, UUID on iOS),
   * discovers its services, and sets up a disconnect listener.
   * 
   * @param {string} deviceId 
   * @param {Function} onDisconnect Callback fired if the band disconnects or goes out of range
   * @returns {Promise<import('react-native-ble-plx').Device>}
   */
  connect: async (deviceId, onDisconnect) => {
    bluetoothService.init();
    bluetoothService.stopScan();

    try {
      const device = await manager.connectToDevice(deviceId, { timeout: 10000 });
      console.log(`Connected to device: ${device.name} (${device.id})`);

      // Must discover services and characteristics before we can interact with it
      await device.discoverAllServicesAndCharacteristics();
      
      // Setup listener for accidental disconnects (separation)
      manager.onDeviceDisconnected(deviceId, (error, d) => {
        console.log(`Device disconnected: ${d.id}`);
        if (onDisconnect) onDisconnect(error, d);
      });

      return device;
    } catch (error) {
      console.error('Failed to connect to BLE device:', error);
      throw error;
    }
  },

  /**
   * Disconnects safely from a device.
   * @param {string} deviceId 
   */
  disconnect: async (deviceId) => {
    if (!manager) return;
    try {
      const isConnected = await manager.isDeviceConnected(deviceId);
      if (isConnected) {
        await manager.cancelDeviceConnection(deviceId);
      }
    } catch (error) {
      console.error('Error during manual disconnect:', error);
    }
  },

  /**
   * Subscribes to the SOS button characteristic on the GPS band.
   * 
   * @param {string} deviceId 
   * @param {string} serviceUUID 
   * @param {string} characteristicUUID 
   * @param {Function} onSosTriggered 
   */
  monitorSosButton: async (deviceId, serviceUUID, characteristicUUID, onSosTriggered) => {
    if (!manager) return;
    
    manager.monitorCharacteristicForDevice(
      deviceId,
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error('Error monitoring SOS characteristic:', error);
          return;
        }
        
        // Read the base64 value and decode it based on your band's protocol
        // If it matches the SOS payload, trigger the callback
        if (characteristic.value) {
          console.log('Received data from band:', characteristic.value);
          // e.g., if (characteristic.value === 'U09T') // "SOS" in base64
          onSosTriggered();
        }
      }
    );
  }
};
