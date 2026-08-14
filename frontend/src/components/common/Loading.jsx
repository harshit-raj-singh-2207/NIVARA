import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export const Loading = ({ text = 'Loading...' }) => {
  return (
    <View
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={text}
      className="flex-1 items-center justify-center p-6 bg-[#F5F9FF] dark:bg-slate-900"
    >
      <ActivityIndicator size="large" color="#5B8DEF" />
      {text && (
        <Text className="text-sm font-bold text-[#64748B] dark:text-slate-400 mt-3.5 tracking-wide">
          {text}
        </Text>
      )}
    </View>
  );
};

export default Loading;
