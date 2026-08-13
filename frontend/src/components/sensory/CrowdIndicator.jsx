/**
 * CrowdIndicator.jsx
 * Crowd density level indicator component for location sensory tracking.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const CrowdIndicator = ({ density = 'low', count = 4 }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  const isHigh = density === 'high';
  const isMedium = density === 'medium';

  let color = colors.status.success;
  let label = 'Low Crowd Density';

  if (isHigh) {
    color = colors.status.error;
    label = 'Crowded Space Warning';
  } else if (isMedium) {
    color = colors.status.warning;
    label = 'Moderate People Nearby';
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 18, marginRight: 6 }}>👥</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            Crowd Density Radar
          </Text>
          <Text style={{ color: color, fontSize: 11, fontWeight: 'bold' }}>
            {label}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: color,
              borderRadius: borderRadius.sm,
              paddingHorizontal: 8,
              paddingVertical: 2,
            },
          ]}
        >
          <Text style={{ color: color, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            ~{count} people nearby
          </Text>
        </View>
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
  },
  badge: {
    borderWidth: 1,
  },
});

export default CrowdIndicator;
