import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';
import Badge from '../common/Badge';

export const SafeZoneCard = ({ zone, onPress }) => {
  return (
    <AppCard onPress={onPress} className="flex-row items-center justify-between">
      <View className="flex-row items-center space-x-3 flex-1 mr-2">
        <View className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 items-center justify-center">
          <Ionicons name="shield-checkmark-outline" size={20} color="#14B8A6" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-slate-900 dark:text-white">{zone.name}</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{zone.radiusMeters}m Radius • {zone.address}</Text>
        </View>
      </View>
      <Badge
        label={zone.inZone ? 'Inside' : 'Outside'}
        variant={zone.inZone ? 'success' : 'warning'}
      />
    </AppCard>
  );
};

export default SafeZoneCard;
