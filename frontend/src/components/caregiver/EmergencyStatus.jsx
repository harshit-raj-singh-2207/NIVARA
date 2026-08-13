import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppCard from '../common/AppCard';
import AppButton from '../common/AppButton';
import { formatDateShort } from '../../utils/dateUtils';
import { EmergencyType, getEventMetadata } from '../../types/safety';

/**
 * Caregiver UI Component.
 * An intrusive banner confirming an active emergency for a tracked individual.
 * Includes prominent CTA to resolve the situation or call authorities.
 *
 * @param {Object} props
 * @param {import('../../types/safety').EmergencyEvent} props.emergency 
 * @param {Function} props.onResolve - Action to clear the emergency 
 * @param {boolean} [props.isLoading=false] 
 */
const EmergencyStatus = ({ emergency, onResolve, isLoading = false }) => {
  if (!emergency) return null;

  // Use the shared metadata engine to extract the right icon and semantic label
  const meta = getEventMetadata(emergency.type);
  const timeString = emergency.createdAt ? formatDateShort(emergency.createdAt) : 'Just now';

  // Customize description based on event type
  let description = 'Action required immediately.';
  if (emergency.type === EmergencyType.SEPARATION) {
    description = 'The GPS band connection was lost. The user may have wandered out of range.';
  } else if (emergency.type === EmergencyType.GEOFENCE_EXIT) {
    description = 'The user exited a designated Safe Zone.';
  } else if (emergency.type === EmergencyType.BAND_SOS) {
    description = 'The physical panic button on the GPS band was pressed.';
  }

  return (
    <AppCard style={styles.card} noPadding>
      {/* Heavy Red Header */}
      <View style={styles.header}>
        <Ionicons name={meta.icon || 'warning'} size={24} color="#ffffff" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>{meta.label || 'EMERGENCY'}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.timeText}>Triggered: {timeString}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.actionRow}>
          {/* A secondary button could be to call 911/authorities, skipping for now to focus on resolve */}
          <AppButton
            title="Mark as Resolved"
            variant="danger"
            onPress={onResolve}
            isLoading={isLoading}
            style={styles.resolveButton}
          />
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: lightTheme.colors.status.emergency,
    borderWidth: 2,
    marginBottom: lightTheme.spacing.lg,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: lightTheme.colors.status.emergency,
    flexDirection: 'row',
    alignItems: 'center',
    padding: lightTheme.spacing.md,
  },
  headerIcon: {
    marginRight: lightTheme.spacing.sm,
  },
  headerTitle: {
    ...lightTheme.typography.h3,
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    padding: lightTheme.spacing.md,
    backgroundColor: lightTheme.colors.status.emergencyBg,
  },
  timeText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.status.emergency,
    fontWeight: '700',
    marginBottom: lightTheme.spacing.sm,
  },
  description: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.primary,
    marginBottom: lightTheme.spacing.lg,
  },
  actionRow: {
    width: '100%',
  },
  resolveButton: {
    width: '100%',
  },
});

export default EmergencyStatus;
