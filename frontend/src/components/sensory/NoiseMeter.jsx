import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const NoiseMeter = ({ decibels = 45 }) => {
  const isHigh = decibels > 70;
  const isModerate = decibels > 55 && decibels <= 70;

  const getColor = () => {
    if (isHigh) return '#EF4444';
    if (isModerate) return '#F59E0B';
    return '#10B981';
  };

  return (
    <AppCard className="flex-1 mr-1.5">
      <View className="flex-row items-center justify-between mb-2">
        <Ionicons name="volume-high-outline" size={22} color={getColor()} />
        <Text className="text-xs font-semibold text-slate-500">Noise Level</Text>
      </View>
      <Text style={{ color: getColor() }} className="text-2xl font-black">{decibels} dB</Text>
      <Text className="text-[11px] text-slate-400 mt-1">
        {isHigh ? 'High Noise' : isModerate ? 'Moderate' : 'Calm Environment'}
      </Text>
    </AppCard>
  );
};

export default NoiseMeter;
