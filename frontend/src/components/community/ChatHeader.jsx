import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../common/Avatar';

export const ChatHeader = ({ name, avatar, isOnline, onBackPress }) => {
  return (
    <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <TouchableOpacity onPress={onBackPress} className="mr-3">
        <Ionicons name="chevron-back" size={24} color="#6366F1" />
      </TouchableOpacity>
      <Avatar source={avatar} name={name} size="sm" isOnline={isOnline} />
      <View className="ml-3 flex-1">
        <Text className="text-base font-bold text-slate-900 dark:text-white">{name}</Text>
        <Text className="text-[11px] text-slate-400">{isOnline ? 'Online' : 'Offline'}</Text>
      </View>
    </View>
  );
};

export default ChatHeader;
