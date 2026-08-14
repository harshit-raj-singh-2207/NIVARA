import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const ResponseSuggestion = ({ text, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(text)}
      className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 mb-2 shadow-sm"
    >
      <Text className="text-sm font-medium text-slate-800 dark:text-slate-200">"{text}"</Text>
    </TouchableOpacity>
  );
};

export default ResponseSuggestion;
