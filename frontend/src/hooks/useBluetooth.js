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
