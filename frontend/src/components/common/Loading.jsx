/**
 * Accessible Reusable Loading Spinner & Overlay Component for NIVARA.
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const Loading = ({
  size = 'large',
  color,
  message,
  overlay = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const spinnerColor = color || colors.primary;

  const content = (
    <View
      style={[
        styles.container,
        overlay && styles.overlayContainer,
        { backgroundColor: overlay ? colors.overlay : 'transparent' },
        style,
      ]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={message || 'Loading content'}
    >
      <View
        style={[
          styles.innerBox,
          overlay && {
            backgroundColor: colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: spacing.lg,
          },
        ]}
      >
        <ActivityIndicator size={size} color={spinnerColor} />
        {message && (
          <Text
            style={[
              styles.message,
              {
                color: colors.text,
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.medium,
                marginTop: spacing.md,
              },
              textStyle,
            ]}
          >
            {message}
          </Text>
        )}
      </View>
    </View>
  );

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  innerBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
  },
});

export default Loading;
