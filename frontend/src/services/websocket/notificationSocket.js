import websocketClient from './websocketClient';

export const notificationSocket = {
  subscribeToNotifications: (callback) => {
    websocketClient.on('NOTIFICATION', callback);
  }
};

export default notificationSocket;
