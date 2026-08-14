import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

const FILTERS = ['ALL', 'CAREGIVERS', 'RESOURCES', 'DISCUSSIONS'];

export const CommunityFilter = ({ activeFilter, onSelectFilter }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-2 mb-2">
      {FILTERS.map((f) => {
        const isSelected = activeFilter === f;
        return (
          <TouchableOpacity
            key={f}
            onPress={() => onSelectFilter(f)}
            className={`px-4 py-2 rounded-full mr-2 border ${
              isSelected
                ? 'bg-indigo-600 border-indigo-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
              {f}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default CommunityFilter;
