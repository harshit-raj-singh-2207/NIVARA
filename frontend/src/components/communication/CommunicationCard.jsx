import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const CommunicationCard = ({ title, category, icon, onPress }) => {
  return (
    <AppCard onPress={onPress} className="flex-row items-center justify-between">
      <View className="flex-row items-center space-x-3">
        <View className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 items-center justify-center">
          <Ionicons name={icon || 'chatbubbles-outline'} size={24} color="#6366F1" />
        </View>
        <View className="ml-3">
          <Text className="text-base font-bold text-slate-900 dark:text-white">{title}</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{category}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
    </AppCard>
  );
};

export default CommunicationCard;
