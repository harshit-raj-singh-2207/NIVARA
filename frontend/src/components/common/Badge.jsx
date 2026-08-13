import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { lightTheme } from '../../theme';

/**
 * Reusable UI Badge / Status Pill.
 * Good for showing discrete statuses like "Connected", "Safe", or "Emergency".
 *
 * @param {Object} props
 * @param {string} props.label - Text to display inside the badge
 * @param {string} [props.status='default'] - 'safe', 'warning', 'emergency', or 'default'
 * @param {boolean} [props.outline=false] - If true, displays with border instead of solid background
 */
const Badge = ({ 
  label, 
  status = 'default',
  outline = false,
  style 
}) => {

  // Determine colors based on status prop mapping to our design tokens
  let bgColor = lightTheme.colors.border;
  let textColor = lightTheme.colors.text.secondary;
  let borderColor = lightTheme.colors.text.secondary;

  switch (status) {
    case 'safe':
    case 'success':
      bgColor = lightTheme.colors.status.safeBg;
      textColor = lightTheme.colors.status.safe;
      borderColor = lightTheme.colors.status.safe;
      break;
    case 'warning':
      bgColor = lightTheme.colors.status.warningBg;
      textColor = lightTheme.colors.status.warning;
      borderColor = lightTheme.colors.status.warning;
      break;
    case 'emergency':
    case 'error':
      bgColor = lightTheme.colors.status.emergencyBg;
      textColor = lightTheme.colors.status.emergency;
      borderColor = lightTheme.colors.status.emergency;
      break;
    case 'primary':
      bgColor = lightTheme.colors.primaryLight;
      textColor = lightTheme.colors.primary;
      borderColor = lightTheme.colors.primary;
      break;
    default:
      // Keep initial default colors
      break;
  }

  const badgeStyle = [
    styles.container,
    outline ? { 
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: borderColor 
    } : { 
      backgroundColor: bgColor 
    },
    style
  ];

  return (
    <View style={badgeStyle}>
      <Text style={[styles.text, { color: textColor }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: lightTheme.spacing.sm,
    paddingVertical: 2,
    borderRadius: lightTheme.borderRadius.round,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...lightTheme.typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default Badge;
