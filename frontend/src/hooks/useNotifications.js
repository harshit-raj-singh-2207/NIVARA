/**
 * Custom React Hook: useNotifications
 * Connects UI components to useNotificationStore and notificationService for push notification permissions, unread count, and emergency SOS alerts.
 */

import { useEffect, useCallback, useState } from 'react';
import useNotificationStore from '../store/notificationStore';
import notificationService from '../services/notifications/notificationService';
import notificationHandlers from '../services/notifications/notificationHandlers';

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    sosActive,
    error,
    fetchNotifications,
    triggerSosAlert,
    cancelSosAlert,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  } = useNotificationStore();

  const [pushToken, setPushToken] = useState(null);

  useEffect(() => {
    fetchNotifications();

    const initPush = async () => {
      const token = await notificationService.registerForPushNotifications();
      setPushToken(token);
    };

    initPush();

    const cleanup = notificationHandlers.registerNotificationListeners((content) => {
      fetchNotifications();
    });

    return () => {
      cleanup();
    };
  }, [fetchNotifications]);

  const handleTriggerSOS = useCallback(
    async (payload = {}) => {
      return await triggerSosAlert(payload);
    },
    [triggerSosAlert]
  );

  return {
    notifications,
    unreadCount,
    pushToken,
    isLoading,
    sosActive,
    error,
    refreshNotifications: fetchNotifications,
    triggerSosAlert: handleTriggerSOS,
    cancelSosAlert,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  };
};

export default useNotifications;
