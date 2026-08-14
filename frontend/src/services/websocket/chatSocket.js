import websocketClient from './websocketClient';

export const chatSocket = {
  subscribeToMessages: (callback) => {
    websocketClient.on('CHAT_MESSAGE', callback);
  },
  sendChatMessage: (chatId, text) => {
    websocketClient.send('CHAT_MESSAGE', { chatId, text });
  }
};

export default chatSocket;
