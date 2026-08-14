import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AppCard from '../common/AppCard';

export const GroupListItem = ({ group, onPress }) => {
  return (
    <AppCard onPress={onPress} className="flex-row items-center justify-between">
      <View>
        <Text className="text-base font-bold text-slate-900 dark:text-white">{group.name}</Text>
        <Text className="text-xs text-slate-500 mt-0.5">{group.membersCount} Members</Text>
      </View>
    </AppCard>
  );
};

export default GroupListItem;
