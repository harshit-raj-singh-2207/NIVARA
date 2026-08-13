import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppCard from '../common/AppCard';
import AppButton from '../common/AppButton';
import { formatDateShort } from '../../utils/dateUtils';
import { EmergencyType } from '../../types/safety';

/**
 * Critical Emergency Card.
 * Renders prominently at the top of the Safety Home / Caregiver view
 * when there is an active emergency.
 *
 * @param {Object} props
 * @param {import('../../types/safety').EmergencyEvent} props.emergency 
 * @param {Function} props.onResolve - Action to clear the emergency (Caregiver only side usually)
 * @param {boolean} [props.isLoading=false] - If the resolve API call is in progress
 */
const EmergencyCard = ({ emergency, onResolve, isLoading = false }) => {
  if (!emergency) return null;

  // Formatting strings based on the emergency type
  let typeTitle = 'EMERGENCY SOS';
  let description = 'Panic button was pressed.';
  let iconName = 'alert';

  switch (emergency.type) {
    case EmergencyType.SEPARATION:
      typeTitle = 'SEPARATION ALERT';
      description = 'GPS Band disconnected. User may have wandered.';
      iconName = 'walk';
      break;
    case EmergencyType.GEOFENCE_EXIT:
      typeTitle = 'ZONE EXIT';
      description = 'Left the designated safe area.';
      iconName = 'exit';
      break;
    case EmergencyType.BATTERY_CRITICAL:
      typeTitle = 'CRITICAL BATTERY';
      description = 'Device battery is extremely low.';
      iconName = 'battery-dead';
      break;
    // Default handles standard SOS and BAND_SOS
  }

  const timeString = emergency.createdAt ? formatDateShort(emergency.createdAt) : 'Just now';

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={32} color="#ffffff" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{typeTitle}</Text>
          <Text style={styles.timeText}>Triggered: {timeString}</Text>
        </View>
      </View>

      <Text style={styles.description}>
        {description}
      </Text>

      {/* 
        In a real app, only Caregivers or admins typically "Resolve" an event. 
        If the autist user clicks this, it might prompt a ConfirmModal to avoid accidental cancellation.
      */}
      <View style={styles.actionContainer}>
        <AppButton
          title="RESOLVE EMERGENCY"
          variant="danger"
          onPress={onResolve}
          isLoading={isLoading}
        />
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightTheme.colors.status.emergencyBg,
    borderColor: lightTheme.colors.status.emergency,
    borderWidth: 2,
    marginBottom: lightTheme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  iconContainer: {
    backgroundColor: lightTheme.colors.status.emergency,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: lightTheme.spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.status.emergency,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timeText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  description: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.primary,
    marginBottom: lightTheme.spacing.lg,
    paddingHorizontal: lightTheme.spacing.xs,
  },
  actionContainer: {
    marginTop: lightTheme.spacing.sm,
  },
});

export default EmergencyCard;
