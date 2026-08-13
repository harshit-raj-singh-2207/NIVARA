<<<<<<< HEAD
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
=======
/**
 * bluetoothService.js
 * Hardware Bluetooth Low Energy (BLE) Integration Service for NIVARA Smart GPS Band.
 * Handles device scanning, pairing, RSSI separation monitoring, battery heartbeats, and hardware SOS triggers.
 */

import { requestBluetoothPermission } from '../../utils/permissionUtils';
import useSafetyStore from '../../store/safetyStore';
import safetyApi from '../api/safetyApi';
import { handleBandSeparation, handleHardwareSOSTrigger } from './bandEvents';

// Standard BLE UUIDs for NIVARA Smart Wearable Band
export const SMART_BAND_SERVICE_UUID = '0000FEEA-0000-1000-8000-00805F9B34FB';
export const HARDWARE_SOS_CHARACTERISTIC_UUID = '0000FEF1-0000-1000-8000-00805F9B34FB';
export const BATTERY_LEVEL_CHARACTERISTIC_UUID = '0000FEF2-0000-1000-8000-00805F9B34FB';

class BluetoothService {
  constructor() {
    this.bleManager = null;
    this.connectedDevice = null;
    this.isScanning = false;
    this.isConnected = false;
    this.rssiMonitorInterval = null;
    this.batterySyncInterval = null;
    this.separationThresholdRssi = -85; // dBm threshold for physical separation

    this.initBleManager();
  }

  /**
   * Initializes BleManager safely.
   */
  initBleManager() {
    try {
      const { BleManager } = require('react-native-ble-plx');
      this.bleManager = new BleManager();
    } catch (e) {
      console.warn('BleManager initialization fallback mode: Native BLE module not active.');
      this.bleManager = null;
    }
  }

  /**
   * Scans for surrounding NIVARA Smart Wearable devices.
   */
  async scanForDevices(onDeviceFound) {
    const permission = await requestBluetoothPermission();
    if (permission?.status !== 'granted') {
      console.warn('Bluetooth permission denied.');
      return;
    }

    if (this.isScanning) return;
    this.isScanning = true;

    if (!this.bleManager) {
      // Simulation fallback for web/Expo dev environment
      setTimeout(() => {
        const mockDevice = {
          id: 'band_ble_402',
          name: 'NIVARA Smart Band #402',
          rssi: -65,
        };
        if (onDeviceFound) onDeviceFound(mockDevice);
        this.isScanning = false;
      }, 1500);
      return;
    }

    this.bleManager.startDeviceScan([SMART_BAND_SERVICE_UUID], null, (error, device) => {
      if (error) {
        console.warn('BLE Scan Error:', error);
        this.isScanning = false;
        return;
      }
      if (device && device.name && onDeviceFound) {
        onDeviceFound({
          id: device.id,
          name: device.name,
          rssi: device.rssi,
        });
      }
    });

    // Auto stop scan after 10s
    setTimeout(() => {
      this.stopScan();
    }, 10000);
  }

  stopScan() {
    if (this.bleManager && this.isScanning) {
      this.bleManager.stopDeviceScan();
    }
    this.isScanning = false;
  }

  /**
   * Connects and pairs with a Smart Band device by ID.
   */
  async connectToDevice(deviceId) {
    this.stopScan();

    try {
      if (!this.bleManager) {
        // Fallback simulation mode
        this.connectedDevice = { id: deviceId, name: 'NIVARA Smart Band #402' };
        this.isConnected = true;

        useSafetyStore.setState({
          bandState: {
            isConnected: true,
            deviceName: 'NIVARA Smart Band #402',
            batteryLevel: 88,
            signalStrength: -65,
            isSeparated: false,
          },
        });

        this.startRssiMonitoring();
        this.startBatteryHeartbeat();
        this.subscribeHardwareSOS();
        return true;
      }

      const device = await this.bleManager.connectToDevice(deviceId, { autoConnect: true });
      await device.discoverAllServicesAndCharacteristics();
      this.connectedDevice = device;
      this.isConnected = true;

      useSafetyStore.setState({
        bandState: {
          isConnected: true,
          deviceName: device.name || 'NIVARA Smart Band',
          batteryLevel: 88,
          signalStrength: device.rssi || -65,
          isSeparated: false,
        },
      });

      this.startRssiMonitoring();
      this.startBatteryHeartbeat();
      this.subscribeHardwareSOS();
      return true;

    } catch (err) {
      console.warn(`Failed to connect to BLE device ${deviceId}:`, err);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Monitors RSSI signal strength to detect physical separation.
   */
  startRssiMonitoring() {
    this.stopRssiMonitoring();
    this.rssiMonitorInterval = setInterval(async () => {
      if (!this.isConnected) return;

      let rssi = -65;
      if (this.bleManager && this.connectedDevice) {
        try {
          const device = await this.connectedDevice.readRSSI();
          rssi = device.rssi;
        } catch (e) {
          rssi = -90;
        }
      } else {
        // Simulated RSSI tick
        rssi = -65 + Math.round((Math.random() - 0.5) * 10);
      }

      if (rssi < this.separationThresholdRssi) {
        const locationData = useSafetyStore.getState().location;
        handleBandSeparation(rssi, locationData);
      }
    }, 5000);
  }

  stopRssiMonitoring() {
    if (this.rssiMonitorInterval) {
      clearInterval(this.rssiMonitorInterval);
      this.rssiMonitorInterval = null;
    }
  }

  /**
   * Periodically retrieves battery level and heartbeat state from the wearable band.
   */
  startBatteryHeartbeat() {
    this.stopBatteryHeartbeat();
    this.batterySyncInterval = setInterval(async () => {
      if (!this.isConnected) return;

      let battery = 88;
      if (this.bleManager && this.connectedDevice) {
        try {
          const characteristic = await this.connectedDevice.readCharacteristicForService(
            SMART_BAND_SERVICE_UUID,
            BATTERY_LEVEL_CHARACTERISTIC_UUID
          );
          if (characteristic && characteristic.value) {
            battery = parseInt(characteristic.value, 10) || 88;
          }
        } catch (e) {}
      }

      const currentState = useSafetyStore.getState().bandState;
      useSafetyStore.setState({
        bandState: {
          ...currentState,
          batteryLevel: battery,
        },
      });
    }, 15000);
  }

  stopBatteryHeartbeat() {
    if (this.batterySyncInterval) {
      clearInterval(this.batterySyncInterval);
      this.batterySyncInterval = null;
    }
  }

  /**
   * Subscribes to real-time notification characteristic for hardware SOS button presses.
   */
  subscribeHardwareSOS() {
    if (!this.bleManager || !this.connectedDevice) return;

    try {
      this.connectedDevice.monitorCharacteristicForService(
        SMART_BAND_SERVICE_UUID,
        HARDWARE_SOS_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) return;
          if (characteristic && characteristic.value) {
            handleHardwareSOSTrigger({ rawValue: characteristic.value });
          }
        }
      );
    } catch (e) {
      console.warn('Hardware SOS characteristic subscription error:', e);
    }
  }

  /**
   * Disconnects current paired BLE Smart Band.
   */
  async disconnect() {
    this.stopRssiMonitoring();
    this.stopBatteryHeartbeat();

    if (this.bleManager && this.connectedDevice) {
      try {
        await this.bleManager.cancelDeviceConnection(this.connectedDevice.id);
      } catch (e) {}
    }

    this.connectedDevice = null;
    this.isConnected = false;

    useSafetyStore.setState({
      bandState: {
        isConnected: false,
        deviceName: 'NIVARA Smart Band #402',
        batteryLevel: 0,
        signalStrength: 0,
        isSeparated: false,
      },
    });
  }
}

export const bluetoothService = new BluetoothService();
export default bluetoothService;
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
