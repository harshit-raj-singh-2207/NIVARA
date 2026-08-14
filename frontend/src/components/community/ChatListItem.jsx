import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Avatar from '../common/Avatar';

export const ChatListItem = ({ chat, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(chat)}
      activeOpacity={0.8}
      className="flex-row items-center p-3.5 bg-white dark:bg-slate-800 rounded-2xl mb-2 border border-slate-100 dark:border-slate-700/60"
    >
      <Avatar source={chat.participantAvatar} name={chat.participantName} size="md" isOnline={chat.isOnline} />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-bold text-slate-900 dark:text-white">{chat.participantName}</Text>
          <Text className="text-[11px] text-slate-400">{chat.lastTime}</Text>
        </View>
        <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1" numberOfLines={1}>
          {chat.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatListItem;
