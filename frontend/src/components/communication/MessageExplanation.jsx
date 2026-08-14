import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MessageExplanation = ({ text, context }) => {
  return (
    <View className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900 my-2">
      <View className="flex-row items-center mb-1">
        <Ionicons name="sparkles-outline" size={18} color="#6366F1" />
        <Text className="text-xs font-bold text-indigo-700 dark:text-indigo-300 ml-1.5">AI Visual Clarifier</Text>
      </View>
      <Text className="text-sm font-semibold text-slate-800 dark:text-slate-100">{text}</Text>
      {context && <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">{context}</Text>}
    </View>
  );
};

export default MessageExplanation;
