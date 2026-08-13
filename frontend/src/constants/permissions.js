/**
 * Permission constants and user-facing messages.
 * Centralised so every permission request uses the same wording.
 */

// ── Permission Types ────────────────────────────────────
export const PERMISSION_TYPES = {
  LOCATION_FOREGROUND: 'location_foreground',
  LOCATION_BACKGROUND: 'location_background',
  BLUETOOTH: 'bluetooth',
  NOTIFICATIONS: 'notifications',
  CAMERA: 'camera',
  MICROPHONE: 'microphone',
  MEDIA_LIBRARY: 'media_library',
};

// ── Status Values ───────────────────────────────────────
export const PERMISSION_STATUS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  UNDETERMINED: 'undetermined',
};

// ── User-Facing Messages ────────────────────────────────
export const PERMISSION_MESSAGES = {
  [PERMISSION_TYPES.LOCATION_FOREGROUND]: {
    title: 'Location Access Needed',
    message:
      'Nivara needs your location to show where you are on the map and monitor safe zones.',
    deniedTitle: 'Location Permission Required',
    deniedMessage:
      'Location access was denied. Please enable it in your device Settings to use safety features.',
  },

  [PERMISSION_TYPES.LOCATION_BACKGROUND]: {
    title: 'Background Location Needed',
    message:
      'Nivara needs background location to alert your caregiver if you leave a safe zone, even when the app is closed.',
    deniedTitle: 'Background Location Required',
    deniedMessage:
      'Background location was denied. Safe zone monitoring will not work. Please enable "Allow all the time" in Settings.',
  },

  [PERMISSION_TYPES.BLUETOOTH]: {
    title: 'Bluetooth Access Needed',
    message:
      'Nivara uses Bluetooth to connect to the GPS safety band and detect if you move too far from the device.',
    deniedTitle: 'Bluetooth Permission Required',
    deniedMessage:
      'Bluetooth access was denied. GPS band features will not work. Please enable Bluetooth permissions in Settings.',
  },

  [PERMISSION_TYPES.NOTIFICATIONS]: {
    title: 'Enable Notifications',
    message:
      'Nivara sends critical safety alerts like SOS notifications and safe zone exits. Keeping notifications on is strongly recommended.',
    deniedTitle: 'Notifications Disabled',
    deniedMessage:
      'Push notifications are disabled. You may miss important safety alerts. Please enable them in Settings.',
  },

  [PERMISSION_TYPES.CAMERA]: {
    title: 'Camera Access Needed',
    message:
      'Nivara uses the camera for profile photos and community posts.',
    deniedTitle: 'Camera Permission Required',
    deniedMessage:
      'Camera access was denied. Please enable it in Settings to take photos.',
  },

  [PERMISSION_TYPES.MICROPHONE]: {
    title: 'Microphone Access Needed',
    message:
      'Nivara uses the microphone for speech-to-text communication features.',
    deniedTitle: 'Microphone Permission Required',
    deniedMessage:
      'Microphone access was denied. Speech features will not work. Please enable it in Settings.',
  },

  [PERMISSION_TYPES.MEDIA_LIBRARY]: {
    title: 'Photo Library Access Needed',
    message:
      'Nivara needs access to your photos for profile pictures and community posts.',
    deniedTitle: 'Photo Access Required',
    deniedMessage:
      'Photo library access was denied. Please enable it in Settings.',
  },
};

// ── Part 2 Required Permissions ─────────────────────────
export const SAFETY_REQUIRED_PERMISSIONS = [
  PERMISSION_TYPES.LOCATION_FOREGROUND,
  PERMISSION_TYPES.LOCATION_BACKGROUND,
  PERMISSION_TYPES.NOTIFICATIONS,
];

export const BAND_REQUIRED_PERMISSIONS = [
  PERMISSION_TYPES.BLUETOOTH,
];
