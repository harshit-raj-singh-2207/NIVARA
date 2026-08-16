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
