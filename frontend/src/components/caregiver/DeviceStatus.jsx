import React from 'react';
import { View, Text } from 'react-native';
import AppCard from '../common/AppCard';

export const DeviceStatus = ({ deviceName = 'NIVARA Band V2', battery = 88, status = 'ACTIVE' }) => {
  return (
    <AppCard className="flex-row items-center justify-between">
      <View>
        <Text className="text-sm font-bold text-slate-900 dark:text-white">{deviceName}</Text>
        <Text className="text-xs text-slate-500 mt-0.5">Status: {status}</Text>
      </View>
      <Text className="text-sm font-semibold text-indigo-600">{battery}% Battery</Text>
    </AppCard>
  );
};

export default DeviceStatus;
