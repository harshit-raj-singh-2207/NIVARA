export const bluetoothService = {
  scanForDevices: async () => {
    return [
      { id: 'BAND-NV-8821', name: 'NIVARA Smart Band V2', rssi: -58 },
      { id: 'BAND-NV-3104', name: 'NIVARA Smart Band', rssi: -72 },
    ];
  },
  connectDevice: async (deviceId) => {
    return { success: true, deviceId, status: 'CONNECTED' };
  }
};

export default bluetoothService;
