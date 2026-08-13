import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppButton from './AppButton';

/**
 * Reusable Empty State component.
 * Displayed when lists have zero items (e.g., no Emergency Contacts, no Safe Zones).
 *
 * @param {Object} props
 * @param {string} props.icon - Ionicons icon name
 * @param {string} props.title - Primary large text
 * @param {string} props.message - Secondary descriptive text
 * @param {string} [props.buttonText] - Optional CTA button label
 * @param {Function} [props.onButtonPress] - Optional CTA action
 * @param {boolean} [props.compact=false] - If true, reduces padding (good for use inside cards)
 */
const EmptyState = ({
  icon,
  title,
  message,
  buttonText,
  onButtonPress,
  compact = false,
  style,
}) => {
  return (
    <View style={[styles.container, compact && styles.compactContainer, style]}>
      {/* Icon Circle */}
      <View style={[styles.iconWrapper, compact && styles.compactIconWrapper]}>
        <Ionicons 
          name={icon} 
          size={compact ? 32 : 48} 
          color={lightTheme.colors.primary} 
        />
      </View>

      {/* Text Content */}
      <Text style={[styles.title, compact && styles.compactTitle]}>
        {title}
      </Text>
      <Text style={[styles.message, compact && styles.compactMessage]}>
        {message}
      </Text>

      {/* Optional Call to Action */}
      {buttonText && onButtonPress && (
        <View style={styles.buttonContainer}>
          <AppButton 
            title={buttonText} 
            onPress={onButtonPress} 
            variant="outline"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: lightTheme.spacing.xl,
    backgroundColor: lightTheme.colors.background,
  },
  compactContainer: {
    padding: lightTheme.spacing.lg,
    backgroundColor: 'transparent',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: lightTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.lg,
  },
  compactIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: lightTheme.spacing.md,
  },
  title: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: lightTheme.spacing.sm,
  },
  compactTitle: {
    ...lightTheme.typography.body1,
    fontWeight: '700',
  },
  message: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: lightTheme.spacing.lg,
  },
  compactMessage: {
    ...lightTheme.typography.body2,
    paddingHorizontal: 0,
  },
  buttonContainer: {
    marginTop: lightTheme.spacing.xl,
    width: '100%',
    maxWidth: 250, // Keep button from stretching too wide on empty screens
  },
});

export default EmptyState;
