import React from 'react';
import { View, Text } from 'react-native';
import AppCard from '../common/AppCard';

export const RoutineStatus = ({ progress = '75%' }) => {
  return (
    <AppCard className="flex-row items-center justify-between">
      <Text className="text-sm font-bold text-slate-900 dark:text-white">Daily Schedule Adherence</Text>
      <Text className="text-sm font-bold text-emerald-600">{progress}</Text>
    </AppCard>
  );
};

export default RoutineStatus;
