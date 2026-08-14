import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const AppHeader = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightAction,
  className = '',
}) => {
  return (
    <View className={`flex-row items-center justify-between px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 ${className}`}>
      <View className="flex-row items-center flex-1 space-x-3">
        {showBack && (
          <TouchableOpacity
            onPress={onBackPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="mr-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 active:bg-slate-100"
          >
            <Ionicons name="chevron-back" size={22} color="#5B8DEF" />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="text-xl font-black text-[#1F2937] dark:text-white" numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-xs font-semibold text-[#64748B] dark:text-slate-400 mt-0.5" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightAction && <View className="ml-2">{rightAction}</View>}
    </View>
  );
};

export default AppHeader;
