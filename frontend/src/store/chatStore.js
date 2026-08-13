/**
 * Chat Zustand Store for NIVARA frontend.
 * Manages direct message conversations, real-time message streams, and typing indicators.
 */

import { create } from 'zustand';
import communityApi from '../services/api/communityApi';

export const useChatStore = create((set, get) => ({
  chats: [
    { id: 'chat_1', name: 'Eleanor Vance', avatar: '👩', lastMessage: 'Checked in on Alex. All safe!', time: '10:45 AM', unreadCount: 2, isOnline: true, isTyping: false, messages: [] },
    { id: 'chat_2', name: 'Dr. Robert Marcus', avatar: '👨‍⚕️', lastMessage: 'Scheduled routine review for tomorrow.', time: 'Yesterday', unreadCount: 0, isOnline: false, isTyping: false, messages: [] },
  ],
  activeChatId: null,
  activeTypingUsers: {}, // { [chatId]: boolean }
  isLoading: false,
  error: null,

  setActiveChatId: (chatId) => set({ activeChatId: chatId }),

  fetchChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await communityApi.getChats();
      set({ chats: data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  appendIncomingMessage: (msgPayload) => {
    const { chats, activeChatId } = get();
    const targetChatId = msgPayload.chatId || activeChatId || 'chat_1';

    const updatedChats = chats.map((chat) => {
      if (chat.id !== targetChatId) return chat;
      const existingMsgs = chat.messages || [];
      return {
        ...chat,
        lastMessage: msgPayload.text || msgPayload.content || 'New message',
        time: 'Just now',
        unreadCount: activeChatId === targetChatId ? chat.unreadCount : chat.unreadCount + 1,
        messages: [...existingMsgs, msgPayload],
      };
    });

    set({ chats: updatedChats });
  },

  setUserTypingStatus: (chatId, isTyping) => {
    const { activeTypingUsers, chats } = get();
    const updatedTyping = { ...activeTypingUsers, [chatId]: isTyping };

    const updatedChats = chats.map((chat) => {
      if (chat.id !== chatId) return chat;
      return { ...chat, isTyping };
    });

    set({ activeTypingUsers: updatedTyping, chats: updatedChats });
  },
}));

export default useChatStore;
