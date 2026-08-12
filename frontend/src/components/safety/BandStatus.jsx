/**
 * BandStatus.jsx
 * Battery level and Bluetooth separation proximity indicator.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const BandStatus = ({ batteryLevel = 88, signalStrength = -65, isSeparated = false }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  const isLowBattery = batteryLevel < 20;

  return (
    <View style={styles.container}>
      {/* Battery Indicator */}
      <View style={styles.statItem}>
        <Text style={{ fontSize: 16, marginRight: 4 }}>
          {isLowBattery ? '🪫' : '🔋'}
        </Text>
        <Text style={{ color: isLowBattery ? colors.status.error : colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
          {batteryLevel}% Battery
        </Text>
      </View>

      {/* Proximity / Separation Status */}
      <View style={styles.statItem}>
        <Text style={{ fontSize: 16, marginRight: 4 }}>
          {isSeparated ? '⚠️' : '📡'}
        </Text>
        <Text style={{ color: isSeparated ? colors.status.error : colors.textSecondary, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
          {isSeparated ? 'Band Separated!' : 'Proximity Safe'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default BandStatus;
