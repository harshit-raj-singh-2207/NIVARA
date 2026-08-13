/**
 * App-wide configuration constants.
 * Environment-specific values should be set in .env and read here.
 */

// ── API ─────────────────────────────────────────────────
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000';
export const API_VERSION = 'v1';
export const API_TIMEOUT = 15000; // 15 seconds

// ── Location ────────────────────────────────────────────
export const LOCATION_CONFIG = {
  /** Minimum meters between location updates */
  distanceInterval: 10,
  /** Minimum milliseconds between location updates */
  timeInterval: 5000,
  /** Background task name registered with expo-task-manager */
  backgroundTaskName: 'NIVARA_BACKGROUND_LOCATION',
  /** How often (ms) background location is sent to server */
  backgroundUploadInterval: 30000,
  /** Default map region (India center) */
  defaultRegion: {
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
};

// ── Geofencing ──────────────────────────────────────────
export const GEOFENCE_CONFIG = {
  /** Default safe zone radius in meters */
  defaultRadius: 250,
  /** Minimum radius allowed */
  minRadius: 50,
  /** Maximum radius allowed */
  maxRadius: 5000,
  /** Task name for geofence monitoring */
  taskName: 'NIVARA_GEOFENCE_TASK',
};

// ── Bluetooth / GPS Band ────────────────────────────────
export const BLUETOOTH_CONFIG = {
  /** BLE scan duration in seconds */
  scanDuration: 10,
  /** Auto-reconnect attempts before alerting */
  maxReconnectAttempts: 5,
  /** Delay between reconnect attempts (ms) */
  reconnectDelay: 3000,
  /** RSSI threshold for separation warning (dBm) */
  separationRssiThreshold: -90,
  /** Seconds of signal loss before separation alert */
  separationTimeout: 30,
  /** GPS band BLE service UUID (placeholder — set to real band UUID) */
  bandServiceUUID: '0000180d-0000-1000-8000-00805f9b34fb',
};

// ── Emergency / SOS ─────────────────────────────────────
export const EMERGENCY_CONFIG = {
  /** Hold duration (ms) to confirm SOS */
  sosHoldDuration: 1500,
  /** Countdown seconds before emergency is dispatched */
  confirmCountdown: 5,
  /** How often (ms) location is shared during active emergency */
  emergencyLocationInterval: 5000,
};

// ── Notifications ───────────────────────────────────────
export const NOTIFICATION_CONFIG = {
  channels: {
    emergency: {
      id: 'nivara-emergency',
      name: 'Emergency Alerts',
      importance: 5, // MAX
      sound: 'emergency_alert',
      vibrationPattern: [0, 500, 200, 500],
    },
    safety: {
      id: 'nivara-safety',
      name: 'Safety Alerts',
      importance: 4, // HIGH
      sound: 'safety_alert',
    },
    general: {
      id: 'nivara-general',
      name: 'General',
      importance: 3, // DEFAULT
    },
  },
};

// ── Feature Flags ───────────────────────────────────────
export const FEATURES = {
  /** Enable live location sharing */
  liveLocationEnabled: true,
  /** Enable GPS band / BLE features */
  gpsBandEnabled: true,
  /** Enable background location tracking */
  backgroundTrackingEnabled: true,
  /** Enable geofence monitoring */
  geofencingEnabled: true,
};

// ── General ─────────────────────────────────────────────
export const APP_CONFIG = {
  name: 'Nivara',
  version: '1.0.0',
  /** Max emergency contacts allowed */
  maxEmergencyContacts: 5,
  /** Max safe zones allowed */
  maxSafeZones: 10,
  /** Animation durations (ms) */
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};
