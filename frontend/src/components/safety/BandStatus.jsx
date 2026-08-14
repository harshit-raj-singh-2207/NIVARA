import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const BandStatus = ({ band }) => {
  return (
    <AppCard className="flex-row items-center justify-between">
      <View className="flex-row items-center space-x-3">
        <View className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 items-center justify-center">
          <Ionicons name="watch-outline" size={20} color="#6366F1" />
        </View>
        <View className="ml-3">
          <Text className="text-base font-bold text-slate-900 dark:text-white">{band?.deviceId || 'NIVARA Band'}</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Heart Rate: {band?.heartRate || 76} BPM</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Connected</Text>
        <Text className="text-xs text-slate-400 mt-0.5">{band?.batteryLevel || 88}% Battery</Text>
      </View>
    </AppCard>
  );
};

export default BandStatus;
