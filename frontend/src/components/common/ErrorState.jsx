import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from './AppButton';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to load content. Please check your connection.',
  onRetry,
}) => {
  return (
    <View className="items-center justify-center p-8 text-center my-6">
      <View className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/50 items-center justify-center mb-4">
        <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
      </View>
      <Text className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</Text>
      <Text className="text-sm text-slate-500 dark:text-slate-400 text-center mb-5 max-w-xs">{message}</Text>
      {onRetry && <AppButton title="Try Again" variant="danger" size="sm" onPress={onRetry} fullWidth={false} />}
    </View>
  );
};

export default ErrorState;
