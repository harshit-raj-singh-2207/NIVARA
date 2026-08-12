/**
 * Permission Key Constants and Rationales for NIVARA frontend.
 */

export const PERMISSION_TYPES = {
  CAMERA: 'camera',
  MEDIA_LIBRARY: 'media_library',
  LOCATION: 'location',
  LOCATION_BACKGROUND: 'location_background',
  MICROPHONE: 'microphone',
  BLUETOOTH: 'bluetooth',
  NOTIFICATIONS: 'notifications',
};

export const PERMISSION_MESSAGES = {
  CAMERA_RATIONALE: 'NIVARA needs camera access so you can capture pictures for AAC visual cards and community posts.',
  MEDIA_LIBRARY_RATIONALE: 'NIVARA needs access to your photo library to attach media files and custom communication cards.',
  LOCATION_RATIONALE: 'NIVARA uses location data to trigger geofence alerts and share your position with primary caregivers in emergencies.',
  LOCATION_BACKGROUND_RATIONALE: 'Background location allows NIVARA to monitor safe zones even when the screen is locked.',
  MICROPHONE_RATIONALE: 'NIVARA uses the microphone for real-time speech-to-text synthesis and ambient noise monitoring.',
  BLUETOOTH_RATIONALE: 'Bluetooth is required to connect to the NIVARA Smart Band for vital sensor data and separation alerts.',
  NOTIFICATIONS_RATIONALE: 'Notifications enable urgent emergency SOS alerts, sensory warnings, and routine transition reminders.',
};

export const PERMISSION_TITLES = {
  CAMERA: 'Camera Permission Required',
  MEDIA_LIBRARY: 'Photos Permission Required',
  LOCATION: 'Location Permission Required',
  MICROPHONE: 'Microphone Permission Required',
  BLUETOOTH: 'Bluetooth Permission Required',
  NOTIFICATIONS: 'Notifications Permission Required',
};

export default {
  PERMISSION_TYPES,
  PERMISSION_MESSAGES,
  PERMISSION_TITLES,
};
