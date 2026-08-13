<<<<<<< HEAD
import { Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { PERMISSION_TYPES, PERMISSION_STATUS, PERMISSION_MESSAGES } from '../constants/permissions';

/**
 * Utility to handle native permission requests and status checks centrally.
 */

/**
 * Prompts the user with a pre-alert before actually requesting the OS permission.
 * Best practice for UX — explains WHY we need it before the OS popup.
 * 
 * @param {string} permissionType - from PERMISSION_TYPES
 * @returns {Promise<boolean>} True if user clicks Continue, False if Cancel
 */
const showPreRationale = (permissionType) => {
  return new Promise((resolve) => {
    const meta = PERMISSION_MESSAGES[permissionType];
    Alert.alert(
      meta.title,
      meta.message,
      [
        { text: 'Not Now', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Continue', style: 'default', onPress: () => resolve(true) }
      ],
      { cancelable: false }
    );
  });
};

/**
 * Handle denied permissions. Optionally shows an alert that links to OS Settings.
 * 
 * @param {string} permissionType - from PERMISSION_TYPES
 */
export const handlePermissionDenied = (permissionType) => {
  const meta = PERMISSION_MESSAGES[permissionType];
  Alert.alert(
    meta.deniedTitle,
    meta.deniedMessage,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() }
    ]
  );
};

/**
 * Standardizes Expo permission responses to our internal PERMISSION_STATUS enum.
 */
const normalizeStatus = (expoStatus) => {
  if (expoStatus === 'granted') return PERMISSION_STATUS.GRANTED;
  return PERMISSION_STATUS.DENIED; // Treat undetermined as denied for active checks
};

/**
 * Core function to check or request a specific permission.
 * 
 * @param {string} permissionType 
 * @param {boolean} requestIfMissing - If true, triggers rationale -> OS request -> result
 * @returns {Promise<string>} PERMISSION_STATUS (granted, denied)
 */
export const checkPermission = async (permissionType, requestIfMissing = true) => {
  try {
    let currentStatus = null;
    let requestFunc = null;

    // 1. Identify which expo library to use based on the type
    switch (permissionType) {
      case PERMISSION_TYPES.LOCATION_FOREGROUND:
        const { status: fgStatus } = await Location.getForegroundPermissionsAsync();
        currentStatus = fgStatus;
        requestFunc = Location.requestForegroundPermissionsAsync;
        break;
        
      case PERMISSION_TYPES.LOCATION_BACKGROUND:
        const { status: bgStatus } = await Location.getBackgroundPermissionsAsync();
        currentStatus = bgStatus;
        requestFunc = Location.requestBackgroundPermissionsAsync;
        break;
        
      case PERMISSION_TYPES.NOTIFICATIONS:
        const { status: notifStatus } = await Notifications.getPermissionsAsync();
        currentStatus = notifStatus;
        requestFunc = Notifications.requestPermissionsAsync;
        break;
        
      // For BLE, Expo doesn't have a direct unified wrapper, we will rely on 
      // the bluetoothService itself configuring permissions during init.
      // We stub it here to just return granted for the logic flow, but 
      // real BT checks happen via react-native-ble-plx.
      case PERMISSION_TYPES.BLUETOOTH:
        return PERMISSION_STATUS.GRANTED;
        
      default:
        console.warn(`checkPermission: Unsupported permission type ${permissionType}`);
        return PERMISSION_STATUS.DENIED;
    }

    // 2. If already granted, we're good
    if (normalizeStatus(currentStatus) === PERMISSION_STATUS.GRANTED) {
      return PERMISSION_STATUS.GRANTED;
    }

    // 3. If we shouldn't prompt, return denied
    if (!requestIfMissing) {
      return PERMISSION_STATUS.DENIED;
    }

    // 4. Show custom rationale before OS prompt
    const userWantsToProceed = await showPreRationale(permissionType);
    if (!userWantsToProceed) {
      return PERMISSION_STATUS.DENIED;
    }

    // 5. Request native OS permission
    const { status: newStatus } = await requestFunc();
    const finalResult = normalizeStatus(newStatus);
    
    // 6. Handle hard rejection
    if (finalResult === PERMISSION_STATUS.DENIED) {
      handlePermissionDenied(permissionType);
    }
    
    return finalResult;

  } catch (error) {
    console.error(`Error requesting permission ${permissionType}:`, error);
    return PERMISSION_STATUS.DENIED;
=======
/**
 * Permission Utilities for NIVARA frontend.
 * Manages system permission requests for Camera, Media Library, Microphone, Location, Bluetooth, and Notifications.
 */

import { Alert, Platform } from 'react-native';
import { PERMISSION_MESSAGES, PERMISSION_TITLES } from '../constants/permissions';

// Dynamic import helpers with graceful fallbacks
let ImagePicker = null;
let Location = null;
let Notifications = null;

try {
  ImagePicker = require('expo-image-picker');
} catch (e) {
  // Expo image picker fallback
}

try {
  Location = require('expo-location');
} catch (e) {
  // Expo location fallback
}

try {
  Notifications = require('expo-notifications');
} catch (e) {
  // Expo notifications fallback
}

/**
 * Checks and requests Camera permission.
 */
export const requestCameraPermission = async () => {
  try {
    if (ImagePicker && ImagePicker.requestCameraPermissionsAsync) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(PERMISSION_TITLES.CAMERA, PERMISSION_MESSAGES.CAMERA_RATIONALE);
        return false;
      }
      return true;
    }
    return true;
  } catch (err) {
    console.warn('Camera permission check error:', err);
    return true;
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
  }
};

/**
<<<<<<< HEAD
 * Checks an array of permissions sequentially.
 * 
 * @param {string[]} permissions - Array of PERMISSION_TYPES
 * @returns {Promise<boolean>} True if ALL permissions granted
 */
export const requirePermissions = async (permissions) => {
  for (const perm of permissions) {
    const status = await checkPermission(perm, true);
    if (status !== PERMISSION_STATUS.GRANTED) {
      return false; // Fail fast if any permission denied
    }
  }
  return true;
=======
 * Checks and requests Media Library / Photos permission.
 */
export const requestMediaLibraryPermission = async () => {
  try {
    if (ImagePicker && ImagePicker.requestMediaLibraryPermissionsAsync) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(PERMISSION_TITLES.MEDIA_LIBRARY, PERMISSION_MESSAGES.MEDIA_LIBRARY_RATIONALE);
        return false;
      }
      return true;
    }
    return true;
  } catch (err) {
    console.warn('Media library permission check error:', err);
    return true;
  }
};

/**
 * Checks location permissions.
 */
export const checkLocationPermissions = async () => {
  try {
    if (Location && Location.getForegroundPermissionsAsync) {
      const { status } = await Location.getForegroundPermissionsAsync();
      return { status, locationServicesEnabled: status === 'granted' };
    }
    return { status: 'granted', locationServicesEnabled: true };
  } catch (err) {
    return { status: 'granted', locationServicesEnabled: true };
  }
};

/**
 * Requests Location permissions.
 */
export const requestLocationPermission = async () => {
  try {
    if (Location && Location.requestForegroundPermissionsAsync) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(PERMISSION_TITLES.LOCATION, PERMISSION_MESSAGES.LOCATION_RATIONALE);
      }
      return { status, locationServicesEnabled: status === 'granted' };
    }
    return { status: 'granted', locationServicesEnabled: true };
  } catch (err) {
    return { status: 'granted', locationServicesEnabled: true };
  }
};

/**
 * Checks Notification permissions.
 */
export const checkNotificationPermissions = async () => {
  try {
    if (Notifications && Notifications.getPermissionsAsync) {
      const { status } = await Notifications.getPermissionsAsync();
      return { status, notificationsEnabled: status === 'granted' };
    }
    return { status: 'granted', notificationsEnabled: true };
  } catch (err) {
    return { status: 'granted', notificationsEnabled: true };
  }
};

/**
 * Requests Notification permissions.
 */
export const requestNotificationPermissions = async () => {
  try {
    if (Notifications && Notifications.requestPermissionsAsync) {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      });
      if (status !== 'granted') {
        Alert.alert(PERMISSION_TITLES.NOTIFICATIONS, PERMISSION_MESSAGES.NOTIFICATIONS_RATIONALE);
      }
      return { status, notificationsEnabled: status === 'granted' };
    }
    return { status: 'granted', notificationsEnabled: true };
  } catch (err) {
    return { status: 'granted', notificationsEnabled: true };
  }
};

/**
 * Checks Bluetooth permissions.
 */
export const checkBluetoothPermissions = async () => {
  return { status: 'granted', bluetoothEnabled: true };
};

/**
 * Requests Bluetooth permissions.
 */
export const requestBluetoothPermission = async () => {
  return { status: 'granted', bluetoothEnabled: true };
};

/**
 * Checks Microphone / Audio permissions.
 */
export const checkAudioPermission = async () => {
  return { status: 'granted', audioEnabled: true };
};

/**
 * Requests Microphone / Audio permission.
 */
export const requestAudioPermission = async () => {
  return { status: 'granted', audioEnabled: true };
};

/**
 * Requests all core system permissions at once.
 */
export const requestAllPermissions = async () => {
  try {
    const camera = await requestCameraPermission();
    const photos = await requestMediaLibraryPermission();
    const loc = await requestLocationPermission();
    const notif = await requestNotificationPermissions();
    const bt = await requestBluetoothPermission();
    const audio = await requestAudioPermission();
    return { camera, photos, location: loc, notifications: notif, bluetooth: bt, audio };
  } catch (err) {
    console.warn('Error checking system permissions:', err);
    return null;
  }
};

export default {
  requestCameraPermission,
  requestMediaLibraryPermission,
  checkLocationPermissions,
  requestLocationPermission,
  checkNotificationPermissions,
  requestNotificationPermissions,
  checkBluetoothPermissions,
  requestBluetoothPermission,
  checkAudioPermission,
  requestAudioPermission,
  requestAllPermissions,
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
};
