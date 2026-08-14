import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from './AppButton';

export const EmptyState = ({
  icon = 'folder-open-outline',
  title = 'No items found',
  description = 'There is no data to show right now.',
  actionLabel,
  onAction,
}) => {
  return (
    <View className="items-center justify-center p-8 text-center my-6">
      <View className="w-16 h-16 rounded-full bg-[#5B8DEF]/10 dark:bg-indigo-950/50 items-center justify-center mb-4">
        <Ionicons name={icon} size={32} color="#5B8DEF" />
      </View>
      <Text className="text-lg font-black text-[#1F2937] dark:text-slate-100 mb-1 text-center">
        {title}
      </Text>
      <Text className="text-sm text-[#64748B] dark:text-slate-400 text-center mb-6 max-w-xs leading-relaxed">
        {description}
      </Text>
      {actionLabel && onAction && (
        <AppButton title={actionLabel} onPress={onAction} size="sm" fullWidth={false} />
      )}
    </View>
  );
};

export default EmptyState;
