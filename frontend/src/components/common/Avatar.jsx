/**
 * Accessible User Avatar Component for NIVARA.
 * Supports image URLs, name initials fallback, status badges, and sensory custom sizing.
 */

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const Avatar = ({
  source,
  name = '',
  size = 'medium',
  status = null,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const getSizePx = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'large':
        return 64;
      case 'xlarge':
        return 80;
      case 'medium':
      default:
        return 48;
    }
  };

  const getFontSizePx = () => {
    switch (size) {
      case 'small':
        return typography.sizes.xs;
      case 'large':
        return typography.sizes.xl;
      case 'xlarge':
        return typography.sizes.xxl;
      case 'medium':
      default:
        return typography.sizes.md;
    }
  };

  const sizePx = getSizePx();
  const fontSizePx = getFontSizePx();

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return colors.status.success;
      case 'busy':
        return colors.status.error;
      case 'offline':
      default:
        return colors.textMuted;
    }
  };

  return (
    <View
      style={[styles.container, { width: sizePx, height: sizePx }, style]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || `Avatar for ${name || 'user'}`}
    >
      {source && typeof source === 'string' ? (
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            {
              width: sizePx,
              height: sizePx,
              borderRadius: sizePx / 2,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        />
      ) : source && typeof source === 'object' ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: sizePx,
              height: sizePx,
              borderRadius: sizePx / 2,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            {
              width: sizePx,
              height: sizePx,
              borderRadius: sizePx / 2,
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.primaryLight,
              borderWidth: 1.5,
            },
          ]}
        >
          <Text
            style={[
              styles.initialsText,
              {
                color: colors.primary,
                fontSize: fontSizePx,
                fontWeight: typography.weights.bold,
              },
              textStyle,
            ]}
          >
            {getInitials(name)}
          </Text>
        </View>
      )}

      {status && (
        <View
          style={[
            styles.statusDot,
            {
              width: Math.max(10, sizePx * 0.25),
              height: Math.max(10, sizePx * 0.25),
              borderRadius: sizePx * 0.125,
              backgroundColor: getStatusColor(),
              borderColor: colors.surface,
              borderWidth: 2,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    textAlign: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default Avatar;
