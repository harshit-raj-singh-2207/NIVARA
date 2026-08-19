/**
 * QuickNeedButton.jsx
 * Fast communication shortcut button for essential sensory & panic needs.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';

export const QuickNeedButton = ({ title, icon, color, onPress, style }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  const bg = color || colors.primary;
 
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: bg,
          borderRadius: borderRadius.lg,
          paddingVertical: 12,
          paddingHorizontal: 12,
          ...shadows.small,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 20, marginRight: 6 }}>{icon || '⚡'}</Text>
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.bold,
          textAlign: 'center',
          flexShrink: 1,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 3,
  },
});

export default QuickNeedButton;
