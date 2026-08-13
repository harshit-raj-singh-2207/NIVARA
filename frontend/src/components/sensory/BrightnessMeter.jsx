/**
 * BrightnessMeter.jsx
 * Ambient lighting & display brightness sensitivity indicator component.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const BrightnessMeter = ({ levelLux = 420, status = 'normal' }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  const isBright = levelLux > 600;
  let statusColor = colors.status.success;
  let statusText = 'Optimal Lighting';

  if (isBright) {
    statusColor = colors.status.warning;
    statusText = 'High Glare / Bright';
  }

  const fillPct = Math.min(100, Math.max(0, (levelLux / 1000) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 18, marginRight: 6 }}>💡</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            Ambient Lighting Level
          </Text>
          <Text style={{ color: statusColor, fontSize: 11, fontWeight: 'bold' }}>
            {statusText}
          </Text>
        </View>
        <Text style={{ color: colors.text, fontSize: typography.sizes.md, fontWeight: 'bold' }}>
          {levelLux} Lux
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

export default BrightnessMeter;
