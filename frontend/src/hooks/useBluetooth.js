import { useState, useEffect } from 'react';
import bandConnection from '../services/bluetooth/bandConnection';

export const useBluetooth = () => {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    bandConnection.getTelemetry().then(setTelemetry);
  }, []);

  return telemetry;
};

export default useBluetooth;
