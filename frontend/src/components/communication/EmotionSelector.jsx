import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EMOTIONS = [
  { label: 'Calm', icon: 'leaf-outline', color: '#10B981' },
  { label: 'Happy', icon: 'happy-outline', color: '#3B82F6' },
  { label: 'Anxious', icon: 'pulse-outline', color: '#F59E0B' },
  { label: 'Overwhelmed', icon: 'warning-outline', color: '#EF4444' },
  { label: 'Tired', icon: 'bed-outline', color: '#8B5CF6' },
];

export const EmotionSelector = ({ selectedEmotion, onSelectEmotion }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-2">
      {EMOTIONS.map((item) => {
        const isSelected = selectedEmotion === item.label;
        return (
          <TouchableOpacity
            key={item.label}
            onPress={() => onSelectEmotion(item.label)}
            style={{ backgroundColor: isSelected ? item.color : '#F1F5F9' }}
            className={`px-4 py-3 rounded-2xl flex-row items-center mr-3 border ${
              isSelected ? 'border-transparent' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <Ionicons name={item.icon} size={20} color={isSelected ? '#FFFFFF' : item.color} />
            <Text className={`ml-2 font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default EmotionSelector;
