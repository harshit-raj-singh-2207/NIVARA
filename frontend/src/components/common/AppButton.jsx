import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';

/**
 * Reusable App Button.
 * Extensively supports variants, loading states, icons, and disabled modes.
 *
 * @param {Object} props
 * @param {string} props.title - Text label for the button
 * @param {Function} props.onPress - Action to fire
 * @param {string} [props.variant='primary'] - 'primary', 'secondary', 'outline', 'danger', or 'ghost'
 * @param {boolean} [props.isLoading=false] - If true, shows spinner and disables button
 * @param {boolean} [props.disabled=false] - Disables interaction and drops opacity
 * @param {string} [props.leftIcon] - Ionicons name to render on left
 * @param {string} [props.rightIcon] - Ionicons name to render on right
 * @param {Object} [props.style] - Override container styles
 */
const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  // Determine styling based on variant
  let bgColor = lightTheme.colors.primary;
  let fgColor = '#ffffff';
  let borderColor = 'transparent';
  let borderWidth = 0;

  switch (variant) {
    case 'secondary':
      bgColor = lightTheme.colors.surfaceHover;
      fgColor = lightTheme.colors.text.primary;
      break;
    case 'outline':
      bgColor = 'transparent';
      fgColor = lightTheme.colors.primary;
      borderColor = lightTheme.colors.primary;
      borderWidth = 1.5;
      break;
    case 'danger':
      bgColor = lightTheme.colors.status.emergency;
      fgColor = '#ffffff';
      break;
    case 'ghost':
      bgColor = 'transparent';
      fgColor = lightTheme.colors.text.secondary;
      break;
    case 'primary':
    default:
      bgColor = lightTheme.colors.primary;
      fgColor = '#ffffff';
      break;
  }

  // Handle Disabled / Loading look
  const isEffectivelyDisabled = disabled || isLoading;
  const opacity = isEffectivelyDisabled ? 0.5 : 1;

  const containerStyle = [
    styles.container,
    {
      backgroundColor: bgColor,
      borderColor,
      borderWidth,
      opacity,
    },
    style,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isEffectivelyDisabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={fgColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={20}
              color={fgColor}
              style={styles.leftIcon}
            />
          )}
          <Text style={[styles.title, { color: fgColor }, textStyle]}>
            {title}
          </Text>
          {rightIcon && (
            <Ionicons
              name={rightIcon}
              size={20}
              color={fgColor}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: lightTheme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: lightTheme.spacing.xl,
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...lightTheme.typography.body1,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  leftIcon: {
    marginRight: lightTheme.spacing.sm,
  },
  rightIcon: {
    marginLeft: lightTheme.spacing.sm,
  },
});

export default AppButton;
