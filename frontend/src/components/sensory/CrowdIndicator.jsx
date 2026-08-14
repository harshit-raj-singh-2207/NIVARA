import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const CrowdIndicator = ({ density = 'MODERATE' }) => {
  return (
    <AppCard className="flex-row items-center justify-between">
      <View className="flex-row items-center space-x-3">
        <View className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 items-center justify-center">
          <Ionicons name="people-outline" size={20} color="#8B5CF6" />
        </View>
        <View className="ml-3">
          <Text className="text-base font-bold text-slate-900 dark:text-white">Crowd Density</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Estimated Nearby Movement</Text>
        </View>
      </View>
      <Text className="text-sm font-bold text-purple-600 dark:text-purple-400">{density}</Text>
    </AppCard>
  );
};

export default CrowdIndicator;
