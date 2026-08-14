import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar = ({ value, onChangeText, placeholder = 'Search...', onClear }) => {
  return (
    <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2.5 mb-3">
      <Ionicons name="search-outline" size={20} color="#94A3B8" className="mr-2" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        className="flex-1 text-sm text-slate-900 dark:text-white p-0 ml-2"
      />
      {value ? (
        <TouchableOpacity onPress={onClear || (() => onChangeText(''))}>
          <Ionicons name="close-circle" size={18} color="#94A3B8" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchBar;
