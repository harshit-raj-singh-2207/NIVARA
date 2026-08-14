import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

export const ChildStatusCard = ({ child }) => {
  return (
    <AppCard>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-3">
          <Avatar source={child?.avatar} name={child?.name} size="md" isOnline={child?.isDeviceConnected} />
          <View className="ml-3">
            <Text className="text-base font-bold text-slate-900 dark:text-white">{child?.name || 'Child'}</Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">Mood: {child?.currentMood || 'Calm'}</Text>
          </View>
        </View>
        <Badge label={child?.inSafeZone ? 'In Safe Zone' : 'Outside'} variant={child?.inSafeZone ? 'success' : 'warning'} />
      </View>
      <View className="flex-row justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-xl">
        <View className="items-center">
          <Text className="text-[10px] text-slate-400">Heart Rate</Text>
          <Text className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{child?.heartRate || 76} BPM</Text>
        </View>
        <View className="items-center">
          <Text className="text-[10px] text-slate-400">Band Battery</Text>
          <Text className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{child?.batteryLevel || 88}%</Text>
        </View>
        <View className="items-center">
          <Text className="text-[10px] text-slate-400">Routines</Text>
          <Text className="text-sm font-bold text-indigo-600 mt-0.5">{child?.routineProgress || '3/4'}</Text>
        </View>
      </View>
    </AppCard>
  );
};

export default ChildStatusCard;
