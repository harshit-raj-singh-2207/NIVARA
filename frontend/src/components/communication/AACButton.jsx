import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const AACButton = ({ item, onPress, isSelected = false }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      style={{ backgroundColor: item.color || '#6366F1' }}
      className={`rounded-2xl p-3 items-center justify-center m-1.5 flex-1 min-h-[95px] shadow-sm ${
        isSelected ? 'border-4 border-slate-900 dark:border-white' : ''
      }`}
    >
      <Ionicons name={item.icon || 'star-outline'} size={32} color="#FFFFFF" />
      <Text className="text-white font-bold text-sm text-center mt-2">{item.label}</Text>
    </TouchableOpacity>
  );
};

export default AACButton;
