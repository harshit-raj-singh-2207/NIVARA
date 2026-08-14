import React from 'react';
import { View, Text, Switch } from 'react-native';
import AppCard from '../common/AppCard';

export const PreferenceCard = ({ title, subtitle, value, onToggle }) => {
  return (
    <AppCard className="flex-row items-center justify-between">
      <View className="flex-1 mr-3">
        <Text className="text-base font-bold text-slate-900 dark:text-white">{title}</Text>
        {subtitle && <Text className="text-xs text-slate-500 mt-0.5">{subtitle}</Text>}
      </View>
      <Switch value={value} onValueChange={onToggle} />
    </AppCard>
  );
};

export default PreferenceCard;
