import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppCard from '../common/AppCard';
import Badge from '../common/Badge';

/**
 * Caregiver UI Component.
 * Displays the current expected routine of the tracked child compared to their actual location.
 * Helps caregivers instantly understand if a routine deviation has occurred.
 *
 * @param {Object} props
 * @param {Object} [props.currentRoutine] - The actively scheduled routine block
 * @param {string} [props.currentRoutine.title] - e.g. "School", "Therapy"
 * @param {string} [props.currentRoutine.timeRange] - e.g. "08:00 AM - 03:00 PM"
 * @param {boolean} [props.isOnTrack=true] - Whether their GPS matches the expected location
 */
const RoutineStatus = ({ currentRoutine, isOnTrack = true }) => {
  if (!currentRoutine) {
    return (
      <AppCard style={styles.card}>
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={32} color={lightTheme.colors.text.tertiary} />
          <Text style={styles.emptyText}>No active routines scheduled right now.</Text>
        </View>
      </AppCard>
    );
  }

  // Visual cues based on whether they are where they are supposed to be
  const trackColor = isOnTrack ? lightTheme.colors.status.safe : lightTheme.colors.status.warning;
  const trackIcon = isOnTrack ? 'checkmark-circle' : 'alert-circle';
  const trackText = isOnTrack ? 'On Track' : 'Deviation Detected';

  return (
    <AppCard style={styles.card} noPadding>
      <View style={styles.header}>
        <Ionicons name="calendar" size={20} color={lightTheme.colors.primary} />
        <Text style={styles.headerTitle}>Current Routine</Text>
        <Badge
          label={trackText}
          status={isOnTrack ? 'safe' : 'warning'}
          style={styles.badgeAlign}
        />
      </View>

      <View style={styles.content}>

        {/* Left: Routine Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.routineTitle} numberOfLines={1}>
            {currentRoutine.title}
          </Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={lightTheme.colors.text.secondary} />
            <Text style={styles.timeText}>{currentRoutine.timeRange}</Text>
          </View>
        </View>

        {/* Right: Deviation/Track Icon */}
        <View style={styles.iconSection}>
          <Ionicons name={trackIcon} size={32} color={trackColor} />
        </View>

      </View>

      {/* Warning Footer if off track */}
      {!isOnTrack && (
        <View style={styles.warningFooter}>
          <Ionicons name="warning-outline" size={16} color={lightTheme.colors.status.warning} />
          <Text style={styles.warningText}>
            User is not at the expected location for this routine.
          </Text>
        </View>
      )}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: lightTheme.spacing.lg,
  },
  emptyContainer: {
    padding: lightTheme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.secondary,
    marginTop: lightTheme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: lightTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
    backgroundColor: lightTheme.colors.surfaceHover,
  },
  headerTitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
    marginLeft: lightTheme.spacing.sm,
    flex: 1,
  },
  badgeAlign: {
    marginLeft: 'auto',
  },
  content: {
    flexDirection: 'row',
    padding: lightTheme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsSection: {
    flex: 1,
  },
  routineTitle: {
    ...lightTheme.typography.h3,
    fontWeight: '700',
    color: lightTheme.colors.text.primary,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.secondary,
    marginLeft: 4,
  },
  iconSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: lightTheme.spacing.md,
  },
  warningFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.status.warningBg,
    padding: lightTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 158, 11, 0.2)', // Light amber border
  },
  warningText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.status.warning,
    marginLeft: lightTheme.spacing.sm,
    fontWeight: '500',
    flex: 1,
  },
});

export default RoutineStatus;
