/**
 * Custom React Hook: useChat
 * Connects chat UI components to useChatStore for direct messages, message streams, and typing status indicators.
 */

import { useEffect, useCallback } from 'react';
import useChatStore from '../store/chatStore';

export const useChat = (chatId = null) => {
  const {
    chats,
    activeChatId,
    activeTypingUsers,
    isLoading,
    error,
    setActiveChatId,
    fetchChats,
    appendIncomingMessage,
    setUserTypingStatus,
  } = useChatStore();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (chatId) {
      setActiveChatId(chatId);
    }
  }, [chatId, setActiveChatId]);

  const targetChatId = chatId || activeChatId;
  const activeChat = chats.find((c) => c.id === targetChatId) || chats[0];

  const handleSendMessage = useCallback(
    (textPayload) => {
      const msgObj = typeof textPayload === 'string' ? { text: textPayload } : textPayload;
      appendIncomingMessage({
        id: `msg_${Date.now()}`,
        chatId: targetChatId,
        senderId: 'me',
        senderName: 'Me',
        ...msgObj,
      });
    },
    [appendIncomingMessage, targetChatId]
  );

  return {
    chats,
    activeChat,
    activeChatId: targetChatId,
    activeTypingUsers,
    isTyping: targetChatId ? !!activeTypingUsers[targetChatId] : false,
    isLoading,
    error,
    setActiveChatId,
    refreshChats: fetchChats,
    sendMessage: handleSendMessage,
    setUserTypingStatus,
  };
};

export default useChat;
