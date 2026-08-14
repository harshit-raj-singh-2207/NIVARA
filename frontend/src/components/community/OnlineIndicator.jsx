import React from 'react';
import { View } from 'react-native';

export const OnlineIndicator = ({ isOnline }) => {
  if (!isOnline) return null;
  return <View className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />;
};

export default OnlineIndicator;
