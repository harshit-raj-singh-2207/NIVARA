import React from 'react';
import { View, Text } from 'react-native';

export const CommentSection = ({ comments = [] }) => {
  return (
    <View className="py-2">
      {comments.map((c, idx) => (
        <View key={idx} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl mb-2">
          <Text className="text-xs font-bold text-slate-900 dark:text-white">{c.author}</Text>
          <Text className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{c.text}</Text>
        </View>
      ))}
    </View>
  );
};

export default CommentSection;
