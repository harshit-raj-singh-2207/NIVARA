import React from 'react';
import { View, Text } from 'react-native';
import Avatar from '../common/Avatar';

export const MemberItem = ({ member }) => {
  return (
    <View className="flex-row items-center p-3 border-b border-slate-100 dark:border-slate-800">
      <Avatar source={member.avatar} name={member.name} size="sm" />
      <View className="ml-3">
        <Text className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</Text>
        <Text className="text-xs text-slate-500">{member.role}</Text>
      </View>
    </View>
  );
};

export default MemberItem;
