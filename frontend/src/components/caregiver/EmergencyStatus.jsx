import React from 'react';
import { View, Text } from 'react-native';
import AppCard from '../common/AppCard';

export const EmergencyStatus = ({ isEmergency = false }) => {
  return (
    <AppCard className={isEmergency ? 'bg-red-500' : 'bg-emerald-500'}>
      <Text className="text-white font-bold text-base">
        {isEmergency ? '⚠️ Emergency Signal Received!' : '✅ All Monitored Devices Safe'}
      </Text>
    </AppCard>
  );
};

export default EmergencyStatus;
