import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';
import Badge from '../common/Badge';

export const RoutineCard = ({ routine, onPress }) => {
  const completedCount = routine.steps.filter(s => s.completed).length;
  const totalCount = routine.steps.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <AppCard onPress={onPress}>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-3">
          <View className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 items-center justify-center">
            <Ionicons name={routine.icon || 'calendar-outline'} size={20} color="#6366F1" />
          </View>
          <View className="ml-2">
            <Text className="text-base font-bold text-slate-900 dark:text-white">{routine.title}</Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">{routine.time}</Text>
          </View>
        </View>
        <Badge
          label={routine.status === 'COMPLETED' ? 'Done' : `${completedCount}/${totalCount} Steps`}
          variant={routine.status === 'COMPLETED' ? 'success' : 'primary'}
        />
      </View>
      <View className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <View style={{ width: `${progressPct}%` }} className="h-full bg-indigo-600 rounded-full" />
      </View>
    </AppCard>
  );
};

export default RoutineCard;
