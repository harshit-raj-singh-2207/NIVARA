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
