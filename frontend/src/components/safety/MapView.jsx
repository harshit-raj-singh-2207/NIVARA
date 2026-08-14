import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MapView = ({ latitude = 28.6139, longitude = 77.2090, label = 'Current Pin' }) => {
  return (
    <View className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl items-center justify-center relative overflow-hidden border border-slate-300 dark:border-slate-700">
      <View className="items-center">
        <Ionicons name="location-sharp" size={36} color="#EF4444" />
        <View className="bg-slate-900/80 px-3 py-1 rounded-full mt-1">
          <Text className="text-white text-xs font-semibold">{label}</Text>
        </View>
        <Text className="text-[10px] text-slate-500 mt-1">Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}</Text>
      </View>
    </View>
  );
};

export default MapView;
