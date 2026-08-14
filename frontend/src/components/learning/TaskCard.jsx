import React from 'react';
import { View, Text } from 'react-native';
import AppCard from '../common/AppCard';

export const TaskCard = ({ task, onPress }) => {
  return (
    <AppCard onPress={onPress}>
      <Text className="text-base font-bold text-slate-900 dark:text-white">{task.title}</Text>
      {task.description && <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">{task.description}</Text>}
    </AppCard>
  );
};

export default TaskCard;
