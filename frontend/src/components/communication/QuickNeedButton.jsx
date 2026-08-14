import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const QuickNeedButton = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 m-1.5 flex-row items-center space-x-3 shadow-sm"
    >
      <View style={{ backgroundColor: item.color || '#6366F1' }} className="w-10 h-10 rounded-xl items-center justify-center">
        <Ionicons name={item.icon || 'star-outline'} size={20} color="#FFFFFF" />
      </View>
      <Text className="text-sm font-bold text-slate-800 dark:text-slate-100 ml-3 flex-1">{item.label}</Text>
    </TouchableOpacity>
  );
};

export default QuickNeedButton;
