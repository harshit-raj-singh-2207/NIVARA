import React from 'react';
import { View, Text } from 'react-native';

export const TypingIndicator = () => {
  return (
    <View className="p-2">
      <Text className="text-xs italic text-slate-400">Typing...</Text>
    </View>
  );
};

export default TypingIndicator;
