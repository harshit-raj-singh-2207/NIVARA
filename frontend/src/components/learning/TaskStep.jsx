import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const TaskStep = ({ step, onToggle }) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      className={`flex-row items-center justify-between p-4 rounded-2xl mb-2.5 border ${
        step.completed
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
      }`}
    >
      <Text className={`text-base font-semibold flex-1 mr-2 ${
        step.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
      }`}>
        {step.title}
      </Text>
      <View className={`w-7 h-7 rounded-full items-center justify-center ${
        step.completed ? 'bg-emerald-500' : 'border-2 border-slate-300 dark:border-slate-600'
      }`}>
        {step.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
  );
};

export default TaskStep;
