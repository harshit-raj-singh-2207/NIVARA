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
  }
};

/**
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
};
