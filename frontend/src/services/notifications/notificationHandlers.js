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
