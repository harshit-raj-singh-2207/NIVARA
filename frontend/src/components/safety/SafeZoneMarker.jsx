import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SafeZoneMarker = ({ name }) => {
  return (
    <View className="items-center bg-teal-600 px-3 py-1.5 rounded-full flex-row space-x-1.5">
      <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
      <Text className="text-white text-xs font-bold">{name}</Text>
    </View>
  );
};

export default SafeZoneMarker;
