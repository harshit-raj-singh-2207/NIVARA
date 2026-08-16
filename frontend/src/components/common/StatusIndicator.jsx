import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const StatusIndicator = ({ status = 'online', size = 12 }) => {
  const { colors } = useTheme();

  let backgroundColor;
  switch (status) {
    case 'online':
      backgroundColor = '#4ade80'; // Success green
      break;
    case 'offline':
      backgroundColor = '#94a3b8'; // Slate gray
      break;
    case 'alert':
      backgroundColor = '#ef4444'; // Danger red
      break;
    default:
      backgroundColor = colors.primary;
  }

  return (
    <View
      style={[
        styles.indicator,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor: colors.card,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    borderWidth: 2,
  },
});

export default StatusIndicator;
