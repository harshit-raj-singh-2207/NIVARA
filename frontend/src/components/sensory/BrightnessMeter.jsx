import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const BrightnessMeter = ({ lux = 300 }) => {
  const isHigh = lux > 700;

  return (
    <AppCard className="flex-1 ml-1.5">
      <View className="flex-row items-center justify-between mb-2">
        <Ionicons name="sunny-outline" size={22} color={isHigh ? '#F59E0B' : '#3B82F6'} />
        <Text className="text-xs font-semibold text-slate-500">Light Meter</Text>
      </View>
      <Text className="text-2xl font-black text-slate-900 dark:text-white">{lux} Lux</Text>
      <Text className="text-[11px] text-slate-400 mt-1">
        {isHigh ? 'Bright Overhead Light' : 'Comfortable Lighting'}
      </Text>
    </AppCard>
  );
};

export default BrightnessMeter;
