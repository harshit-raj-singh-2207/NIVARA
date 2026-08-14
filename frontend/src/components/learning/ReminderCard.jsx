import React from 'react';
import { View, Text, Switch } from 'react-native';
import AppCard from '../common/AppCard';

export const ReminderCard = ({ reminder, onToggle }) => {
  return (
    <AppCard className="flex-row items-center justify-between">
      <View>
        <Text className="text-base font-bold text-slate-900 dark:text-white">{reminder.title}</Text>
        <Text className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{reminder.time}</Text>
      </View>
      <Switch
        value={reminder.isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
        thumbColor={reminder.isEnabled ? '#4F46E5' : '#F1F5F9'}
      />
    </AppCard>
  );
};

export default ReminderCard;
