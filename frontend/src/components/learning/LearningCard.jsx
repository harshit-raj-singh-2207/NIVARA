import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const LearningCard = ({ topic, onPress }) => {
  return (
    <AppCard onPress={onPress}>
      <View className="flex-row items-center space-x-3 mb-3">
        <View style={{ backgroundColor: topic.color || '#6366F1' }} className="w-12 h-12 rounded-2xl items-center justify-center">
          <Ionicons name={topic.icon || 'book-outline'} size={24} color="#FFFFFF" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-slate-900 dark:text-white">{topic.title}</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{topic.count}</Text>
        </View>
      </View>
      <View className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <View style={{ width: `${(topic.progress || 0) * 100}%`, backgroundColor: topic.color || '#6366F1' }} className="h-full rounded-full" />
      </View>
    </AppCard>
  );
};

export default LearningCard;
