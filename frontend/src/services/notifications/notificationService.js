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
