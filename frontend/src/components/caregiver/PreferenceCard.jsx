import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppCard from '../common/AppCard';

/**
 * Caregiver UI Component.
 * A card with a toggle switch to manage specific notification routing preferences.
 *
 * @param {Object} props
 * @param {string} props.title - Title of the preference (e.g., "Geofence Alerts")
 * @param {string} props.description - Detailed explanation (e.g., "Notify me when they leave a Safe Zone")
 * @param {boolean} props.icon - Ionicons identifier
 * @param {boolean} props.value - Current toggle state (true/false)
 * @param {Function} props.onToggle - Callback when the switch is flipped
 * @param {boolean} [props.disabled=false] - Disables the toggle temporarily (e.g. while syncing API)
 */
const PreferenceCard = ({ 
  title, 
  description, 
  icon, 
  value, 
  onToggle, 
  disabled = false 
}) => {
  return (
    <AppCard style={[styles.card, disabled && styles.cardDisabled]} noPadding>
      <View style={styles.container}>
        
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          <Ionicons 
            name={icon} 
            size={24} 
            color={disabled ? lightTheme.colors.text.tertiary : lightTheme.colors.primary} 
          />
        </View>

        {/* Center Text block */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, disabled && styles.textDisabled]}>
            {title}
          </Text>
          <Text style={[styles.description, disabled && styles.textDisabled]}>
            {description}
          </Text>
        </View>

        {/* Right Toggle */}
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ 
              false: lightTheme.colors.border, 
              true: lightTheme.colors.primaryLight 
            }}
            thumbColor={value ? lightTheme.colors.primary : '#f4f3f4'}
            ios_backgroundColor={lightTheme.colors.surfaceHover}
            onValueChange={onToggle}
            value={value}
            disabled={disabled}
          />
        </View>

      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: lightTheme.spacing.md,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: lightTheme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: lightTheme.colors.surfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: lightTheme.spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: lightTheme.spacing.sm,
  },
  title: {
    ...lightTheme.typography.body1,
    fontWeight: '600',
    color: lightTheme.colors.text.primary,
    marginBottom: 4,
  },
  description: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    lineHeight: 18,
  },
  textDisabled: {
    color: lightTheme.colors.text.tertiary,
  },
  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PreferenceCard;
