<<<<<<< HEAD
import * as Notifications from 'expo-notifications';
import { ROUTES } from '../../constants/routes';
import { useNotificationStore } from '../../store/notificationStore';

/**
 * Handles incoming push notifications routing and deep linking.
 */
export const notificationHandlers = {
  
  /**
   * Sets up listeners for incoming notifications while the app is foregrounded,
   * and listeners for when a user TAPS on a notification (from background or foreground).
   * 
   * @param {Object} navigation - React Navigation reference (passed from App.jsx)
   * @returns {Function} cleanup function to remove listeners
   */
  setupListeners: (navigation) => {
    
    // 1. Fired when a notification is RECEIVED while the app is FOREGROUNDED
    const responseListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Foreground notification received:', notification.request.content.title);
      
      // We can parse it and inject it directly into the Zustand store to update tab badges
      const payload = {
        id: notification.request.identifier,
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data,
        isRead: false,
        receivedAt: new Date().toISOString()
      };
      
      useNotificationStore.getState().addRealtimeNotification(payload);
    });

    // 2. Fired when the user TAPS on a notification to open the app
    const clickListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('User tapped notification with data:', data);

      if (!navigation || !navigation.navigate) {
        console.warn('Navigation ref not ready for notification routing');
        return;
      }

      // Route the user based on payload type
      if (data?.type) {
        switch (data.type) {
          
          case 'EMERGENCY_SOS':
          case 'SEPARATION_ALERT':
            // Caregiver tapped an SOS alert -> Take them instantly to the child's tracking screen
            if (data.childId) {
              navigation.navigate(ROUTES.ROOT.MAIN, {
                screen: ROUTES.TABS.CAREGIVER,
                params: {
                  screen: ROUTES.CAREGIVER.CHILD_STATUS,
                  params: { childId: data.childId }
                }
              });
            }
            break;

          case 'COMMUNITY_MESSAGE':
            // Part 3 feature - route to chat
            if (data.chatId) {
              navigation.navigate(ROUTES.ROOT.MAIN, {
                screen: ROUTES.TABS.COMMUNITY,
                params: {
                  screen: ROUTES.COMMUNITY.DIRECT_MESSAGE,
                  params: { chatId: data.chatId }
                }
              });
            }
            break;

          default:
            // Route to general notifications inbox by default
            navigation.navigate(ROUTES.ROOT.MAIN, {
              screen: ROUTES.TABS.HOME,
              params: {
                screen: ROUTES.HOME.NOTIFICATIONS
              }
            });
        }
      }
    });

    // Return cleanup function to be called in App.jsx useEffect cleanup
    return () => {
      Notifications.removeNotificationSubscription(responseListener);
      Notifications.removeNotificationSubscription(clickListener);
    };
  }
};
=======
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
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
