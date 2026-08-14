import useNotificationStore from '../store/notificationStore';

export const useNotifications = () => {
  return useNotificationStore();
};

export default useNotifications;
