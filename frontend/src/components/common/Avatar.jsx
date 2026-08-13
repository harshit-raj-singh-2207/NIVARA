import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { lightTheme } from '../../theme';

/**
 * Reusable Avatar component.
 * Displays an image if provided, falling back to initials with a colored background.
 *
 * @param {Object} props
 * @param {string} [props.imageUrl] - URL of the avatar image
 * @param {string} [props.name] - Full name used to generate fallback initials
 * @param {number} [props.size=48] - Dimensions (width/height) of the avatar
 * @param {string} [props.fallbackColor] - Background color for the initials fallback
 */
const Avatar = ({
  imageUrl,
  name = 'User',
  size = 48,
  fallbackColor = lightTheme.colors.primary,
  style
}) => {

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const containerStyle = [
    styles.container,
    { width: size, height: size, borderRadius: size / 2 },
    style
  ];

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={containerStyle}
        resizeMode="cover"
      />
    );
  }

  // Calculate dynamic font size based on container size
  const fontSize = size * 0.4;

  return (
    <View style={[...containerStyle, { backgroundColor: fallbackColor }]}>
      <Text style={[styles.initials, { fontSize }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: lightTheme.colors.border, // Default if no fallback provided
  },
  initials: {
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default Avatar;
