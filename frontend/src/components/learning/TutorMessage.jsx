import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const TutorMessage = ({ message }) => {
  const isTutor = message.sender === 'TUTOR';

  return (
    <View className={`my-1.5 flex-row ${isTutor ? 'justify-start' : 'justify-end'}`}>
      {isTutor && (
        <View className="w-8 h-8 rounded-full bg-indigo-600 items-center justify-center mr-2 self-end mb-1">
          <Ionicons name="hardware-chip-outline" size={16} color="#FFFFFF" />
        </View>
      )}
      <View className={`max-w-[80%] p-3.5 rounded-2xl ${
        isTutor
          ? 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-none'
          : 'bg-indigo-600 rounded-br-none'
      }`}>
        <Text className={`text-sm ${isTutor ? 'text-slate-800 dark:text-slate-100' : 'text-white'}`}>
          {message.text}
        </Text>
        <Text className={`text-[10px] mt-1 ${isTutor ? 'text-slate-400' : 'text-indigo-200'} text-right`}>
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
};

export default TutorMessage;
