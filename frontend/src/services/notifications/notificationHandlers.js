/**
 * Push Notification Event Handlers for NIVARA frontend.
 * Manages foreground notifications, background notifications, and notification tap responses with dynamic navigation routing.
 */

import { navigate } from '../../navigation/navigationRef';
import { MAIN_ROUTES, HOME_ROUTES } from '../../constants/routes';

let Notifications = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  // Graceful fallback if expo-notifications is missing
}

let notificationListener = null;
let responseListener = null;

/**
 * Handles incoming notification payload and routes dynamically.
 * @param {object} notificationContent - Content payload from notification
 */
export const handleNotificationRouting = (notificationContent) => {
  const data = notificationContent?.data || {};
  const alertType = data.type || data.alert_type;

  switch (alertType) {
    case 'EMERGENCY_SOS':
    case 'emergency':
      // Route directly to Notifications screen or Home tab for SOS response
      navigate(MAIN_ROUTES.HOME_TAB, {
        screen: HOME_ROUTES.NOTIFICATIONS,
        params: { activeSos: true, alertData: data },
      });
      break;

    case 'SENSORY_WARNING':
    case 'sensory':
      navigate(MAIN_ROUTES.HOME_TAB, {
        screen: HOME_ROUTES.HOME,
        params: { tab: 'sensory', alertData: data },
      });
      break;

    case 'ROUTINE_REMINDER':
    case 'routine':
      navigate(MAIN_ROUTES.HOME_TAB, {
        screen: HOME_ROUTES.HOME,
        params: { tab: 'routine', taskId: data.taskId },
      });
      break;

    case 'CHAT_MESSAGE':
    case 'chat':
      navigate(MAIN_ROUTES.COMMUNITY_TAB, {
        screen: 'ChatDetailScreen',
        params: { chatId: data.chatId },
      });
      break;

    default:
      navigate(MAIN_ROUTES.HOME_TAB, {
        screen: HOME_ROUTES.NOTIFICATIONS,
      });
      break;
  }
};

/**
 * Subscribes to Expo Notification listeners for foreground receiving and user tap responses.
 * @param {Function} [onNotificationReceived] - Optional custom callback when notification is received in foreground
 * @returns {Function} Cleanup function to unsubscribe listeners
 */
export const registerNotificationListeners = (onNotificationReceived = null) => {
  if (!Notifications || !Notifications.addNotificationReceivedListener) {
    return () => {};
  }

  // Listener 1: Notification received while app is in Foreground
  notificationListener = Notifications.addNotificationReceivedListener((notification) => {
    const content = notification?.request?.content;
    if (onNotificationReceived) {
      onNotificationReceived(content);
    }
  });

  // Listener 2: User Taps / Interacts with Notification
  responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    const content = response?.notification?.request?.content;
    handleNotificationRouting(content);
  });

  return () => {
    if (notificationListener && Notifications.removeNotificationSubscription) {
      Notifications.removeNotificationSubscription(notificationListener);
    }
    if (responseListener && Notifications.removeNotificationSubscription) {
      Notifications.removeNotificationSubscription(responseListener);
    }
  };
};

export default {
  handleNotificationRouting,
  registerNotificationListeners,
};
