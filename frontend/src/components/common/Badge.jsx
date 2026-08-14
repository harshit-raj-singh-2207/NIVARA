import React from 'react';
import { View, Text } from 'react-native';

export const Badge = ({ label, variant = 'primary', className = '' }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success': return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300';
      case 'warning': return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300';
      case 'danger': return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
      case 'info': return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300';
      case 'sensory': return 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300';
      case 'primary':
      default: return 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300';
    }
  };

  return (
    <View className={`self-start px-2.5 py-1 rounded-full ${getBadgeStyle()} ${className}`}>
      <Text className="text-xs font-semibold">{label}</Text>
    </View>
  );
};

export default Badge;
