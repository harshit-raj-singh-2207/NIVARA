<<<<<<< HEAD
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { NOTIFICATION_CONFIG } from '../../constants/config';
import { checkPermission } from '../../utils/permissionUtils';
import { PERMISSION_TYPES, PERMISSION_STATUS } from '../../constants/permissions';
import { useNotificationStore } from '../../store/notificationStore';

/**
 * Configure how notifications appear when the app is in the foreground.
 * We want safety alerts to visibly drop down even if the user is using the app.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Service to manage local and push notifications via Expo.
 */
export const notificationService = {

  /**
   * Initializes notification channels (Android) and registers for push tokens.
   * Should be called on app boot.
   */
  init: async () => {
    await notificationService.setupAndroidChannels();
    await notificationService.registerForPushNotifications();
  },

  /**
   * Sets up Android-specific Notification Channels.
   * Required to control sounds, vibrations, and importance levels (e.g. making Emergency alerts loud).
   */
  setupAndroidChannels: async () => {
    if (Platform.OS === 'android') {
      const { emergency, safety, general } = NOTIFICATION_CONFIG.channels;

      await Notifications.setNotificationChannelAsync(emergency.id, {
        name: emergency.name,
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: emergency.vibrationPattern,
        lightColor: '#ef4444', // Red
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true, // Emergency alerts should bypass Do Not Disturb
      });

      await Notifications.setNotificationChannelAsync(safety.id, {
        name: safety.name,
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: '#f59e0b', // Amber
      });

      await Notifications.setNotificationChannelAsync(general.id, {
        name: general.name,
        importance: Notifications.AndroidImportance.DEFAULT,
        lightColor: '#3b82f6', // Blue
      });
    }
  },

  /**
   * Requests necessary permissions and registers the device with Expo's Push service.
   * Syncs the resulting token to the Zustand store / backend.
   */
  registerForPushNotifications: async () => {
    try {
      if (!Platform.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return;
      }

      const status = await checkPermission(PERMISSION_TYPES.NOTIFICATIONS, true);
      
      if (status !== PERMISSION_STATUS.GRANTED) {
        console.warn('Notification permission denied. Push alerts will not work.');
        return;
      }

      // Get the token that uniquely identifies this device
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        console.warn('EAS Project ID missing in app.json. Cannot get push token.');
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
      const token = tokenData.data;
      
      console.log('Expo Push Token received:', token);

      // Save token to store, which triggers the API call to link it to the user's account
      useNotificationStore.getState().registerPushToken(token);

    } catch (error) {
      console.error('Failed to get push token:', error);
    }
  },

  /**
   * Clears the app icon badge count (iOS only).
   */
  clearBadgeCount: async () => {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.warn('Failed to clear badge count:', error);
    }
  },

  /**
   * (Optional) Schedules a local notification.
   * Useful for reminders or firing local fallback alerts if network is down.
   */
  scheduleLocalAlert: async (title, body, channelId = NOTIFICATION_CONFIG.channels.general.id) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  }
};
=======
/**
 * Push Notification Service for NIVARA frontend.
 * Manages push token generation, Android high-priority channel setup (SOS emergency alerts),
 * foreground alert handling configuration, and backend token synchronization.
 */

import { Platform } from 'react-native';
import userApi from '../api/userApi';
import { requestNotificationPermissions } from '../../utils/permissionUtils';

let Notifications = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  // Graceful fallback if expo-notifications is missing
}

// Configure default in-app notification behavior
if (Notifications && Notifications.setNotificationHandler) {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const data = notification?.request?.content?.data || {};
      const isUrgent = data.type === 'emergency' || data.type === 'EMERGENCY_SOS';

      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: isUrgent
          ? Notifications.AndroidNotificationPriority.MAX
          : Notifications.AndroidNotificationPriority.HIGH,
      };
    },
  });
}

/**
 * Sets up Android high-priority notification channels for emergency SOS and sensory alerts.
 */
export const setupNotificationChannels = async () => {
  if (Platform.OS !== 'android' || !Notifications || !Notifications.setNotificationChannelAsync) {
    return;
  }

  try {
    // Channel 1: High Priority Emergency SOS Alerts
    await Notifications.setNotificationChannelAsync('emergency_sos_channel', {
      name: '🚨 Emergency SOS Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#EF4444',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    });

    // Channel 2: Sensory Overload & Comfort Alerts
    await Notifications.setNotificationChannelAsync('sensory_alerts_channel', {
      name: '🎧 Sensory Overload Warnings',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F59E0B',
      sound: 'default',
      enableVibrate: true,
    });

    // Channel 3: Routine & Learning Reminders
    await Notifications.setNotificationChannelAsync('routine_reminders_channel', {
      name: '⏰ Routine Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  } catch (err) {
    console.warn('Failed to configure Android notification channels:', err);
  }
};

/**
 * Registers device for push notifications, retrieves Expo Push Token, and syncs with backend userApi.
 * @returns {Promise<string|null>} Push token string
 */
export const registerForPushNotifications = async () => {
  try {
    const permResult = await requestNotificationPermissions();
    if (!permResult || !permResult.notificationsEnabled) {
      return null;
    }

    await setupNotificationChannels();

    let token = null;
    if (Notifications && Notifications.getExpoPushTokenAsync) {
      const tokenObj = await Notifications.getExpoPushTokenAsync();
      token = tokenObj.data;
    } else {
      token = `mock_push_token_${Date.now()}`;
    }

    if (token) {
      try {
        await userApi.updatePushToken(token);
      } catch (syncErr) {
        console.warn('Failed to sync push token with backend:', syncErr);
      }
    }

    return token;
  } catch (err) {
    console.warn('Push notification registration error:', err);
    return null;
  }
};

/**
 * Schedules a local device notification.
 * @param {object} payload - { title, body, data, triggerSeconds }
 */
export const scheduleLocalNotification = async ({ title, body, data = {}, triggerSeconds = 1 }) => {
  try {
    if (Notifications && Notifications.scheduleNotificationAsync) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: triggerSeconds > 0 ? { seconds: triggerSeconds } : null,
      });
    }
  } catch (err) {
    console.warn('Failed to schedule local notification:', err);
  }
};

export default {
  setupNotificationChannels,
  registerForPushNotifications,
  scheduleLocalNotification,
};
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
