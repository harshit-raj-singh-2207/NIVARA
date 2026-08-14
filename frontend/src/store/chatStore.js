import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  activeChatId: 'chat_1',
  chats: [
    {
      id: 'chat_1',
      participantName: 'Priya Sharma (Mom)',
      participantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      isOnline: true,
      lastMessage: 'Are you ready for your afternoon break?',
      lastTime: '10:15 AM',
      unreadCount: 1,
    },
    {
      id: 'chat_2',
      participantName: 'Dr. Ananya Varma',
      participantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      isOnline: false,
      lastMessage: 'Great progress on the routine chart today!',
      lastTime: 'Yesterday',
      unreadCount: 0,
    }
  ],
  messages: {
    chat_1: [
      { id: 'm1', senderId: 'usr_cg_100', senderName: 'Priya Sharma', text: 'Hi Aarav, remember to take a short water break!', timestamp: '10:00 AM', isMe: false },
      { id: 'm2', senderId: 'usr_001', senderName: 'Aarav Sharma', text: 'Okay Mom, I just finished my morning routine.', timestamp: '10:05 AM', isMe: true },
      { id: 'm3', senderId: 'usr_cg_100', senderName: 'Priya Sharma', text: 'Are you ready for your afternoon break?', timestamp: '10:15 AM', isMe: false },
    ]
  },

  setActiveChat: (chatId) => set({ activeChatId: chatId }),

  sendMessage: (chatId, text) => set(state => {
    const chatMsgs = state.messages[chatId] || [];
    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: 'usr_001',
      senderName: 'Aarav Sharma',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    return {
      messages: {
        ...state.messages,
        [chatId]: [...chatMsgs, newMsg]
      },
      chats: state.chats.map(c => c.id === chatId ? { ...c, lastMessage: text, lastTime: 'Just now' } : c)
    };
  })
}));

export default useChatStore;
