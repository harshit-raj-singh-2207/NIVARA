/**
 * Accessible Reusable Button Component for NIVARA.
 * Supports theme variants, tactile press animation, loading state, and screen reader accessibility.
 */

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme';

export const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  fullWidth = true,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const { theme } = useTheme();
  const { colors, borderRadius, spacing, typography } = theme;

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.surfaceSubtle,
            borderWidth: 1,
            borderColor: colors.border,
          },
          text: { color: colors.text },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary,
          },
          text: { color: colors.primary },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: { color: colors.primary },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.status.error,
          },
          text: { color: '#FFFFFF' },
        };
      case 'highContrast':
        return {
          container: {
            backgroundColor: '#FFFF00',
            borderWidth: 2,
            borderColor: '#000000',
          },
          text: { color: '#000000', fontWeight: '800' },
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: colors.primary,
          },
          text: { color: '#FFFFFF' },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.xs + 2,
          paddingHorizontal: spacing.md,
          fontSize: typography.sizes.sm,
        };
      case 'large':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          fontSize: typography.sizes.lg,
        };
      case 'medium':
      default:
        return {
          paddingVertical: spacing.sm + 4,
          paddingHorizontal: spacing.lg,
          fontSize: typography.sizes.md,
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      style={[
        styles.button,
        variantStyle.container,
        {
          borderRadius: borderRadius.md,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variantStyle.text.color}
            style={styles.spinner}
          />
        ) : (
          <>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <Text
              style={[
                styles.text,
                {
                  fontSize: sizeStyle.fontSize,
                  fontWeight: typography.weights.bold,
                  color: variantStyle.text.color,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  spinner: {
    paddingVertical: 2,
  },
});

export default AppButton;
