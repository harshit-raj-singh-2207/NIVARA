import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export const SentenceSuggestion = ({ suggestions = [], onSelect }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-2">
      {suggestions.map((s, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => onSelect(s)}
          className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-3.5 py-2 rounded-xl mr-2"
        >
          <Text className="text-xs font-medium text-indigo-700 dark:text-indigo-300">{s}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default SentenceSuggestion;
