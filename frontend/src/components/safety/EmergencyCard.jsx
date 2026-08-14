import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const EmergencyCard = ({ status = 'ACTIVE', time = 'Just now' }) => {
  return (
    <AppCard className="bg-red-500 border-transparent">
      <View className="flex-row items-center space-x-3">
        <Ionicons name="warning-outline" size={28} color="#FFFFFF" />
        <View className="ml-3 flex-1">
          <Text className="text-white font-bold text-lg">Emergency SOS Dispatched</Text>
          <Text className="text-white/90 text-xs mt-0.5">Caregivers and primary contacts have been alerted. {time}</Text>
        </View>
      </View>
    </AppCard>
  );
};

export default EmergencyCard;
