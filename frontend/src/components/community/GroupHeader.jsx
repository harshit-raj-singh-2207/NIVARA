import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const GroupHeader = ({ title, membersCount, onBackPress }) => {
  return (
    <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <TouchableOpacity onPress={onBackPress} className="mr-3">
        <Ionicons name="chevron-back" size={24} color="#6366F1" />
      </TouchableOpacity>
      <View>
        <Text className="text-lg font-bold text-slate-900 dark:text-white">{title}</Text>
        <Text className="text-xs text-slate-500">{membersCount} Members</Text>
      </View>
    </View>
  );
};

export default GroupHeader;
