import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SOSButton = ({ onPress, isEmergencyActive = false }) => {
  return (
    <View className="items-center justify-center my-6">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        className={`w-44 h-44 rounded-full items-center justify-center shadow-2xl border-4 ${
          isEmergencyActive
            ? 'bg-red-600 border-red-400 animate-pulse'
            : 'bg-rose-500 border-rose-300'
        }`}
      >
        <Ionicons name="alert-circle" size={56} color="#FFFFFF" />
        <Text className="text-white font-black text-2xl mt-1">
          {isEmergencyActive ? 'SOS ACTIVE' : 'PRESS SOS'}
        </Text>
        <Text className="text-white/80 text-[11px] font-semibold mt-1">Alert Caregivers</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SOSButton;
