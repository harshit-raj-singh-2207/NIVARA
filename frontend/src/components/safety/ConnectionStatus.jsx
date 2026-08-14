import React from 'react';
import { View, Text } from 'react-native';

export const ConnectionStatus = ({ isConnected = true }) => {
  return (
    <View className="flex-row items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
      <View className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
      <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {isConnected ? 'Online' : 'Disconnected'}
      </Text>
    </View>
  );
};

export default ConnectionStatus;
