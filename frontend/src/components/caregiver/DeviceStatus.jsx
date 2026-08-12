/**
 * DeviceStatus.jsx
 * GPS Band battery percentage and Bluetooth sync state component.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const DeviceStatus = ({ device }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  const deviceName = device?.deviceName || 'NIVARA Smart Band #402';
  const batteryPct = device?.batteryLevel ?? 88;
  const isConnected = device?.isConnected ?? true;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          padding: 10,
          marginBottom: 8,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 18, marginRight: 6 }}>⌚</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            {deviceName}
          </Text>
          <Text
            style={{
              color: isConnected ? colors.status.success : colors.status.error,
              fontSize: 10,
              fontWeight: 'bold',
            }}
          >
            {isConnected ? 'BLE Synced (Online)' : 'Band Disconnected'}
          </Text>
        </View>

        <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
          🔋 {batteryPct}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DeviceStatus;
