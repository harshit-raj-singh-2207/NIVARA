import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const ResourceCard = ({ title, category, description }) => {
  return (
    <AppCard>
      <View className="flex-row items-center space-x-3 mb-2">
        <Ionicons name="document-text-outline" size={22} color="#6366F1" />
        <View className="ml-2">
          <Text className="text-base font-bold text-slate-900 dark:text-white">{title}</Text>
          <Text className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{category}</Text>
        </View>
      </View>
      <Text className="text-xs text-slate-500 dark:text-slate-400">{description}</Text>
    </AppCard>
  );
};

export default ResourceCard;
