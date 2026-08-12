/**
 * ConnectionStatus.jsx
 * Bluetooth BLE connection status badge for Smart GPS Wearable Band.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const ConnectionStatus = ({ isConnected = true, deviceName = 'NIVARA Smart Band #402', onPairPress }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  const statusColor = isConnected ? colors.status.success : colors.status.error;
  const statusText = isConnected ? 'Connected (Active)' : 'Disconnected';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          paddingHorizontal: 12,
          paddingVertical: 8,
        },
      ]}
    >
      <View style={styles.leftRow}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: statusColor,
              borderRadius: borderRadius.full,
            },
          ]}
        />
        <View style={{ marginLeft: 8 }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            {deviceName}
          </Text>
          <Text style={{ color: statusColor, fontSize: 10, fontWeight: 'bold' }}>
            {statusText}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={onPairPress} style={styles.pairBtn}>
        <Text style={{ color: colors.primary, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
          {isConnected ? 'Band Settings' : 'Pair Band'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
  },
  pairBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
});

export default ConnectionStatus;
