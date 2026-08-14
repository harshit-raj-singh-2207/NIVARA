import React from 'react';
import { View } from 'react-native';

export const ProgressBar = ({ progress = 0, color = '#6366F1', className = '' }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1) * 100;

  return (
    <View className={`w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${className}`}>
      <View style={{ width: `${clampedProgress}%`, backgroundColor: color }} className="h-full rounded-full" />
    </View>
  );
};

export default ProgressBar;
