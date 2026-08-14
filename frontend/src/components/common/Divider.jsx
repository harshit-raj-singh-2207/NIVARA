import React from 'react';
import { View } from 'react-native';

export const Divider = ({ className = '' }) => {
  return <View className={`h-px w-full bg-slate-200 dark:bg-slate-800 my-3 ${className}`} />;
};

export default Divider;
