import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SensoryAlert = ({ alert, onDismiss }) => {
  if (!alert) return null;

  return (
    <View className="bg-amber-500 p-4 rounded-2xl flex-row items-center justify-between shadow-md mb-4">
      <View className="flex-row items-center flex-1 mr-2">
        <Ionicons name="warning-outline" size={24} color="#FFFFFF" />
        <View className="ml-3 flex-1">
          <Text className="text-white font-bold text-sm">Sensory Alert</Text>
          <Text className="text-white/90 text-xs mt-0.5">{alert.message}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onDismiss} className="bg-white/20 p-1.5 rounded-full">
        <Ionicons name="close" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default SensoryAlert;
