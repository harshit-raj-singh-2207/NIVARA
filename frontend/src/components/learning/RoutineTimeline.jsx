import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const RoutineTimeline = ({ routines }) => {
  return (
    <View className="py-2">
      {routines.map((item, idx) => (
        <View key={item.id} className="flex-row items-start mb-4">
          <View className="items-center mr-3">
            <View className={`w-8 h-8 rounded-full items-center justify-center ${
              item.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}>
              <Ionicons name={item.status === 'COMPLETED' ? 'checkmark' : 'time-outline'} size={16} color="#FFFFFF" />
            </View>
            {idx < routines.length - 1 && <View className="w-0.5 h-10 bg-slate-200 dark:bg-slate-700 my-1" />}
          </View>
          <View className="flex-1 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
            <Text className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{item.time}</Text>
            <Text className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.title}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default RoutineTimeline;
