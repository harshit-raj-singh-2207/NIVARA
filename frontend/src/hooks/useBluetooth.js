<<<<<<< HEAD
import { useState, useCallback, useEffect } from 'react';
import { useSafetyStore } from '../store/safetyStore';
import { bluetoothService } from '../services/bluetooth/bluetoothService';
import { bandConnection } from '../services/bluetooth/bandConnection';

/**
 * Custom React hook for UI components to interact with the GPS Band.
 * Bridges the gap between the complex connection logic and React state for rendering.
 */
export const useBluetooth = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);

  // Pull global band status from Zustand
  const { bandStatus } = useSafetyStore();

  /**
   * Starts a BLE scan to find nearby devices to pair with.
   * Updates the `discoveredDevices` state array for rendering in a list.
   */
  const startScan = useCallback(async () => {
    setIsScanning(true);
    setScanError(null);
    setDiscoveredDevices([]);

    try {
      await bluetoothService.startScan(
        // On device found
        (device) => {
          setDiscoveredDevices((prev) => {
            // Prevent duplicates
            if (prev.find((d) => d.id === device.id)) return prev;
            return [...prev, device];
          });
        },
        // On Error
        (error) => {
          setScanError(error.message);
          setIsScanning(false);
        }
      );

      // Auto-stop scanning flag after config timeout
      // Note: bluetoothService already stops the actual radio scan internally
      setTimeout(() => setIsScanning(false), 10000); 

    } catch (err) {
      setScanError(err.message);
      setIsScanning(false);
    }
  }, []);

  /**
   * Stops the active scan manually.
   */
  const stopScan = useCallback(() => {
    bluetoothService.stopScan();
    setIsScanning(false);
  }, []);

  /**
   * Connects to a specific band from the discovered list.
   * @param {string} deviceId 
   */
  const connectToBand = useCallback(async (deviceId) => {
    stopScan();
    setScanError(null);
    try {
      // Calls our orchestrator, which handles the complex retry/SOS logic
      await bandConnection.startConnection(deviceId);
    } catch (err) {
      setScanError('Failed to connect to the band.');
    }
  }, [stopScan]);

  /**
   * Disconnects from the currently connected band.
   */
  const disconnectBand = useCallback(async () => {
    if (bandStatus.deviceId) {
      await bandConnection.stopConnection(bandStatus.deviceId);
    }
  }, [bandStatus.deviceId]);

  // Clean up scans if the component unmounts mid-scan
  useEffect(() => {
    return () => {
      if (isScanning) {
        bluetoothService.stopScan();
      }
    };
  }, [isScanning]);

  return {
    // Current State
    bandStatus,
    isScanning,
    scanError,
    discoveredDevices,
    
    // Actions
    startScan,
    stopScan,
    connectToBand,
    disconnectBand
  };
};
=======
/**
 * Custom React Hook: useBluetooth
 * Manages BLE Smart Band device scanning, RSSI signal drops, connection state, battery level, and separation alerts.
 */

import { useEffect, useState, useCallback } from 'react';
import useSafetyStore from '../store/safetyStore';
import bandConnection from '../services/bluetooth/bandConnection';
import bluetoothService from '../services/bluetooth/bluetoothService';

export const useBluetooth = () => {
  const { bandState, fetchSafetyOverview } = useSafetyStore();
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Starts scanning for nearby BLE Smart Band devices.
   */
  const startScan = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    try {
      if (bluetoothService && bluetoothService.startScan) {
        await bluetoothService.startScan((device) => {
          setDiscoveredDevices((prev) => {
            if (prev.some((d) => d.id === device.id)) return prev;
            return [...prev, device];
          });
        });
      } else {
        // Fallback demo device
        setDiscoveredDevices([
          { id: 'band_402', name: 'NIVARA Smart Band #402', rssi: -65, battery: 88 },
        ]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => setIsScanning(false), 5000);
    }
  }, []);

  /**
   * Pairs with a targeted BLE device.
   */
  const connectToDevice = useCallback(async (deviceId) => {
    try {
      if (bandConnection && bandConnection.connectBand) {
        await bandConnection.connectBand(deviceId);
      }
      await fetchSafetyOverview();
    } catch (err) {
      setError(err.message);
    }
  }, [fetchSafetyOverview]);

  useEffect(() => {
    // Monitor band connection status on mount
    fetchSafetyOverview();
  }, [fetchSafetyOverview]);

  return {
    bandState,
    isScanning,
    discoveredDevices,
    error,
    startScan,
    connectToDevice,
  };
};

export default useBluetooth;
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
