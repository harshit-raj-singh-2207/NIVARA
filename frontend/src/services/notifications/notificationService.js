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
