import React from 'react';
import { View, FlatList } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import ChatHeader from '../../components/community/ChatHeader';
import ChatBubble from '../../components/community/ChatBubble';
import ChatInput from '../../components/community/ChatInput';
import useChatStore from '../../store/chatStore';

export const DirectMessageScreen = ({ route, navigation }) => {
  const { chatId = 'chat_1' } = route.params || {};
  const { chats, messages, sendMessage } = useChatStore();
  const chatInfo = chats.find(c => c.id === chatId) || chats[0];
  const chatMsgs = messages[chatId] || [];

  return (
    <SafeAreaWrapper>
      <ChatHeader
        name={chatInfo.participantName}
        avatar={chatInfo.participantAvatar}
        isOnline={chatInfo.isOnline}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={chatMsgs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ChatBubble message={item} />}
      />
      <ChatInput onSend={(text) => sendMessage(chatId, text)} />
    </SafeAreaWrapper>
  );
};

export default DirectMessageScreen;
