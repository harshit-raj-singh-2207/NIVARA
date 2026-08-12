/**
 * Accessible Reusable Card Container for NIVARA.
 * Provides sensory-friendly elevation, borders, and touch interaction handling.
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const AppCard = ({
  children,
  onPress,
  variant = 'default',
  style,
  contentStyle,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, shadows, spacing } = theme;

  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        };
      case 'elevated':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.medium,
        };
      case 'sensoryHighlight':
        return {
          backgroundColor: colors.surfaceSubtle,
          borderWidth: 2,
          borderColor: colors.primaryLight,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.small,
        };
    }
  };

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      accessible={true}
      accessibilityRole={onPress ? 'button' : 'summary'}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={[
        styles.card,
        {
          borderRadius: borderRadius.lg,
          padding: spacing.md,
        },
        getVariantStyles(),
        style,
      ]}
      {...props}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: 6,
  },
  content: {
    width: '100%',
  },
});

export default AppCard;
