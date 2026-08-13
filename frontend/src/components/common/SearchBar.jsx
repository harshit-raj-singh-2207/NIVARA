/**
 * SearchBar.jsx
 * Reusable search bar input component with clear button.
 */

import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const SearchBar = ({ value, onChangeText, placeholder = 'Search chats, groups, or posts...', onClear, style }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.text,
            fontSize: typography.sizes.xs,
          },
        ]}
      />
      {value ? (
        <TouchableOpacity onPress={onClear || (() => onChangeText(''))}>
          <Text style={{ color: colors.textMuted, fontSize: 14, fontWeight: 'bold' }}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});

export default SearchBar;
