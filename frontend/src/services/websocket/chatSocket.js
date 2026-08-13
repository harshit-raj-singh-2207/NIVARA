/**
 * chatSocket.js
 * Domain-specific Chat & Emergency Socket Handlers for NIVARA.
 * Connects real-time messages, typing indicators, and instant SOS broadcasts to Zustand stores.
 */

import websocketClient from './websocketClient';
import useChatStore from '../../store/chatStore';
import useNotificationStore from '../../store/notificationStore';

class ChatSocketHandler {
  constructor() {
    this.activeSubscriptions = new Set();
    this.isInitialized = false;
  }

  /**
   * Initializes listeners for core WebSocket events.
   */
  init() {
    if (this.isInitialized) return;

    // Connect to WebSocket server if not connected
    websocketClient.connect();

    // Listener 1: NEW_MESSAGE
    websocketClient.on('NEW_MESSAGE', (payload) => {
      console.log('💬 Socket Received NEW_MESSAGE:', payload);
      useChatStore.getState().appendIncomingMessage(payload);
    });

    // Listener 2: USER_TYPING
    websocketClient.on('USER_TYPING', (payload) => {
      const { chatId, isTyping } = payload;
      console.log(`✍️ Socket Received USER_TYPING for chat ${chatId}:`, isTyping);
      useChatStore.getState().setUserTypingStatus(chatId, isTyping);
    });

    // Listener 3: EMERGENCY_SOS_BROADCAST
    websocketClient.on('EMERGENCY_SOS_BROADCAST', (payload) => {
      console.log('🚨 Socket Received EMERGENCY_SOS_BROADCAST:', payload);
      useNotificationStore.getState().triggerSosAlert(payload);
    });

    this.isInitialized = true;
  }

  /**
   * Subscribes/joins target chat channel room.
   * @param {string} chatId - Target conversation channel ID
   */
  subscribeToChat(chatId) {
    this.init();
    if (!chatId) return;
    this.activeSubscriptions.add(chatId);
    websocketClient.emit('SUBSCRIBE_CHAT', { chatId });
  }

  /**
   * Unsubscribes/leaves target chat channel room.
   * @param {string} chatId - Target conversation channel ID
   */
  unsubscribeFromChat(chatId) {
    if (!chatId) return;
    this.activeSubscriptions.delete(chatId);
    websocketClient.emit('UNSUBSCRIBE_CHAT', { chatId });
  }

  /**
   * Sends a direct message payload over WebSocket.
   * @param {string} chatId - Target conversation channel ID
   * @param {string} text - Message content text
   */
  sendDirectMessage(chatId, text) {
    this.init();
    websocketClient.emit('SEND_MESSAGE', {
      chatId,
      text,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Sends a user typing status indicator over WebSocket.
   * @param {string} chatId - Target conversation channel ID
   * @param {boolean} isTyping - Typing state boolean flag
   */
  sendTypingIndicator(chatId, isTyping) {
    this.init();
    websocketClient.emit('TYPING_STATUS', {
      chatId,
      isTyping,
    });
  }

  /**
   * Cleanup and unsubscribe all active listeners.
   */
  destroy() {
    this.activeSubscriptions.clear();
    websocketClient.off('NEW_MESSAGE');
    websocketClient.off('USER_TYPING');
    websocketClient.off('EMERGENCY_SOS_BROADCAST');
    this.isInitialized = false;
  }
}

export const chatSocket = new ChatSocketHandler();
export default chatSocket;
