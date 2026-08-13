/**
 * ProgressBar.jsx
 * Accessible progress bar component with percentage indicator for routine completion tracking.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const ProgressBar = ({
  progress = 0,
  height = 10,
  color,
  backgroundColor,
  showPercentage = true,
  style,
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

  const validProgress = Math.max(0, Math.min(progress > 1 ? progress / 100 : progress, 1));
  const percentage = Math.round(validProgress * 100);

  const barColor = color || colors.primary;
  const trackColor = backgroundColor || colors.surfaceSubtle;

  return (
    <View style={[styles.container, style]}>
      {showPercentage && (
        <View style={styles.labelRow}>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.xs,
              fontWeight: typography.weights.bold,
            }}
          >
            Routine Progress
          </Text>
          <Text
            style={{
              color: barColor,
              fontSize: typography.sizes.xs,
              fontWeight: typography.weights.bold,
            }}
          >
            {percentage}%
          </Text>
        </View>
      )}

      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: trackColor,
            borderRadius: borderRadius.full,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              height,
              backgroundColor: barColor,
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    transition: 'width 0.3s ease',
  },
});

export default ProgressBar;
