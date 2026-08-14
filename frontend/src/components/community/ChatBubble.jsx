import React from 'react';
import { View, Text } from 'react-native';

export const ChatBubble = ({ message }) => {
  const isMe = message.isMe;

  return (
    <View className={`my-1.5 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
      <View className={`max-w-[78%] p-3.5 rounded-2xl ${
        isMe
          ? 'bg-indigo-600 rounded-br-none'
          : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-none'
      }`}>
        <Text className={`text-sm ${isMe ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
          {message.text}
        </Text>
        <Text className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'} text-right`}>
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
};

export default ChatBubble;
