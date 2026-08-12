/**
 * OnlineIndicator.jsx
 * Online status dot badge component.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';

export const OnlineIndicator = ({ isOnline = true, size = 10, style }) => {
  const { theme } = useTheme();
  const { colors, borderRadius } = theme;

  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isOnline ? colors.status.success : colors.textMuted,
          borderColor: '#FFFFFF',
          borderWidth: 1.5,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {},
});

export default OnlineIndicator;
