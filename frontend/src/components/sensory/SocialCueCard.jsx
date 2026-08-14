import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const SocialCueCard = ({ cue }) => {
  return (
    <AppCard>
      <View className="flex-row items-center mb-2">
        <Ionicons name="eye-outline" size={20} color="#6366F1" />
        <Text className="text-base font-bold text-slate-900 dark:text-white ml-2">{cue.title}</Text>
      </View>
      <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Meaning: {cue.meaning}</Text>
      <View className="bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900">
        <Text className="text-xs text-indigo-700 dark:text-indigo-300">💡 Suggestion: {cue.suggestion}</Text>
      </View>
    </AppCard>
  );
};

export default SocialCueCard;
