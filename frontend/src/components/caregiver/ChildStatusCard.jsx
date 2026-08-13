import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

/**
 * Summary Card for a child displayed on the Caregiver's main dashboard.
 * 
 * @param {Object} props
 * @param {import('../../types/caregiver').ChildProfile} props.child - The child's profile data
 * @param {import('../../types/caregiver').CaregiverStatusSummary} props.status - The child's live status data
 * @param {Function} props.onPress - Action to navigate to the child's detailed view
 */
const ChildStatusCard = ({ child, status, onPress }) => {
  if (!child || !status) return null;

  const { safety, currentLocation } = status;

  // Determine UI coloring based on active emergency or warnings
  let borderColor = 'transparent';
  let badgeStatus = 'safe';
  let badgeLabel = 'Safe';
  let bgColor = lightTheme.colors.surface;

  if (safety?.isEmergencyActive) {
    borderColor = lightTheme.colors.status.emergency;
    badgeStatus = 'emergency';
    badgeLabel = 'Emergency';
    bgColor = lightTheme.colors.status.emergencyBg;
  } else if (!safety?.isSafe || !safety?.isBandConnected) {
    borderColor = lightTheme.colors.status.warning;
    badgeStatus = 'warning';
    badgeLabel = 'Warning';
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor, backgroundColor: bgColor },
        borderColor !== 'transparent' && styles.cardElevated
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentRow}>

        {/* Left: Avatar */}
        <Avatar
          name={child.name}
          imageUrl={child.avatarUrl}
          size={56}
          style={styles.avatar}
        />

        {/* Center: Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {child.name}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={lightTheme.colors.text.secondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {safety?.isInsideSafeZone && safety?.currentZoneName
                ? safety.currentZoneName
                : (currentLocation?.address || 'Unknown Location')}
            </Text>
          </View>
        </View>

        {/* Right: Status Badge & Chevron */}
        <View style={styles.rightContainer}>
          <Badge label={badgeLabel} status={badgeStatus} />
          <Ionicons
            name="chevron-forward"
            size={20}
            color={lightTheme.colors.text.tertiary}
            style={styles.chevron}
          />
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.md,
    marginBottom: lightTheme.spacing.md,
    borderWidth: 2,
    ...lightTheme.shadows.sm,
  },
  cardElevated: {
    ...lightTheme.shadows.md,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: lightTheme.spacing.md,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    ...lightTheme.typography.body1,
    fontWeight: '700',
    color: lightTheme.colors.text.primary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    marginLeft: 4,
    flex: 1,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 48,
  },
  chevron: {
    marginTop: 'auto',
  },
});

export default ChildStatusCard;
