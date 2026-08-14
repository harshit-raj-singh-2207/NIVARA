import React from 'react';
import { View, Text, Switch } from 'react-native';
import AppCard from '../common/AppCard';

export const SensoryPreference = ({ title, subtitle, value, onValueChange }) => {
  return (
    <AppCard className="flex-row items-center justify-between">
      <View className="flex-1 mr-3">
        <Text className="text-base font-bold text-slate-900 dark:text-white">{title}</Text>
        {subtitle && <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#CBD5E1', true: '#14B8A6' }}
        thumbColor={value ? '#0D9488' : '#F1F5F9'}
      />
    </AppCard>
  );
};

export default SensoryPreference;
