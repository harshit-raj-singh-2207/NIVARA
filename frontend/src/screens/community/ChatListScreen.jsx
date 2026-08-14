import React from 'react';
import { View, FlatList } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import ChatListItem from '../../components/community/ChatListItem';
import useChatStore from '../../store/chatStore';

export const ChatListScreen = ({ navigation }) => {
  const { chats } = useChatStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Direct Messages" showBack onBackPress={() => navigation.goBack()} />
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <ChatListItem chat={item} onPress={(c) => navigation.navigate('DirectMessage', { chatId: c.id })} />
        )}
      />
    </SafeAreaWrapper>
  );
};

export default ChatListScreen;
