import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AppCard from '../common/AppCard';
import AppButton from '../common/AppButton';

export const GroupCard = ({ group, onJoin }) => {
  return (
    <AppCard>
      <Image source={{ uri: group.image }} className="w-full h-28 rounded-xl mb-3 bg-slate-200" />
      <Text className="text-base font-bold text-slate-900 dark:text-white">{group.name}</Text>
      <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">{group.membersCount} Members • {group.category}</Text>
      <AppButton
        title={group.isJoined ? 'Joined' : 'Join Group'}
        variant={group.isJoined ? 'outline' : 'primary'}
        size="sm"
        onPress={() => onJoin && onJoin(group)}
      />
    </AppCard>
  );
};

export default GroupCard;
