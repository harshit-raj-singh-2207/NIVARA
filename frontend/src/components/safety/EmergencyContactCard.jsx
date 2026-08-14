import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../common/AppCard';

export const EmergencyContactCard = ({ contact, onCall }) => {
  return (
    <AppCard className="flex-row items-center justify-between">
      <View className="flex-row items-center space-x-3 flex-1 mr-2">
        <View className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 items-center justify-center">
          <Ionicons name="person-outline" size={20} color="#6366F1" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-slate-900 dark:text-white">{contact.name}</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{contact.relation} • {contact.phone}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onCall}
        className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center"
      >
        <Ionicons name="call-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </AppCard>
  );
};

export default EmergencyContactCard;
