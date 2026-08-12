/**
 * NoiseMeter.jsx
 * Real-time decibel sound meter component with user threshold indicator.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const NoiseMeter = ({ levelDb = 72, thresholdDb = 85, status = 'safe' }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  const isExceeded = levelDb >= thresholdDb;
  let statusColor = colors.status.success;
  let statusLabel = 'Quiet / Safe';

  if (isExceeded || status === 'critical') {
    statusColor = colors.status.error;
    statusLabel = 'High Noise Alert!';
  } else if (levelDb >= thresholdDb - 10 || status === 'warning') {
    statusColor = colors.status.warning;
    statusLabel = 'Moderate Noise';
  }

  const fillPct = Math.min(100, Math.max(0, (levelDb / 120) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 18, marginRight: 6 }}>🎧</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            Ambient Sound Level
          </Text>
          <Text style={{ color: statusColor, fontSize: 11, fontWeight: 'bold' }}>
            {statusLabel} • Limit: {thresholdDb} dB
          </Text>
        </View>
        <Text style={{ color: colors.text, fontSize: typography.sizes.md, fontWeight: 'bold' }}>
          {levelDb} dB
        </Text>
      </View>

      <View
        style={[
          styles.track,
          {
            backgroundColor: colors.surfaceSubtle,
            borderRadius: borderRadius.full,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${fillPct}%`,
              backgroundColor: statusColor,
              borderRadius: borderRadius.full,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  track: {
    height: 10,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: 10,
  },
});

export default NoiseMeter;
