import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const LocationCard = ({ location }) => {
  return (
    <AppCard className="flex-row items-center space-x-3">
      <View className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 items-center justify-center">
        <Ionicons name="location-outline" size={20} color="#10B981" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-base font-bold text-slate-900 dark:text-white">Current Location</Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5" numberOfLines={1}>
          {location?.address || 'Connaught Place, New Delhi'}
        </Text>
      </View>
    </AppCard>
  );
};

export default LocationCard;
