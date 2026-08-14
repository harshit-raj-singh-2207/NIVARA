import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const CurrentLocationCard = ({ locationName = 'Home Safe Zone', address = 'B-12 Greenwood Enclave' }) => {
  return (
    <AppCard className="flex-row items-center space-x-3">
      <View className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 items-center justify-center">
        <Ionicons name="navigate-outline" size={20} color="#6366F1" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-sm font-bold text-slate-900 dark:text-white">{locationName}</Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{address}</Text>
      </View>
    </AppCard>
  );
};

export default CurrentLocationCard;
