import React from 'react';
import { View, Text } from 'react-native';
import Avatar from '../common/Avatar';

export const CaregiverHeader = ({ caregiverName, title = 'Caregiver Dashboard' }) => {
  return (
    <View className="flex-row items-center justify-between p-4 bg-indigo-600 rounded-b-3xl mb-4">
      <View>
        <Text className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Welcome back</Text>
        <Text className="text-xl font-bold text-white mt-0.5">{caregiverName || 'Priya Sharma'}</Text>
      </View>
      <Avatar name={caregiverName || 'Priya'} size="md" />
    </View>
  );
};

export default CaregiverHeader;
