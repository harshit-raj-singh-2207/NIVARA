import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppCard from '../common/AppCard';
import AppMapView from '../safety/MapView';
import { formatDateShort } from '../../utils/dateUtils';

/**
 * Caregiver UI Component.
 * Displays the child's live location on a map with a text overlay of their last known address.
 *
 * @param {Object} props
 * @param {import('../../types/safety').LocationRecord} props.location - The child's current GPS location
 * @param {import('../../types/safety').SafeZone[]} [props.safeZones=[]] - Zones to draw on the map
 */
const CurrentLocationCard = ({ location, safeZones = [] }) => {
  if (!location) {
    return (
      <AppCard style={styles.card}>
        <View style={styles.emptyContainer}>
          <Ionicons name="location-outline" size={32} color={lightTheme.colors.text.tertiary} />
          <Text style={styles.emptyText}>Waiting for location update...</Text>
        </View>
      </AppCard>
    );
  }

  const timeString = location.timestamp ? `Updated ${formatDateShort(location.timestamp)}` : 'Live Tracking Active';

  return (
    <AppCard style={styles.card} noPadding>
      {/* Map Area */}
      <View style={styles.mapWrapper}>
        <AppMapView
          location={location}
          safeZones={safeZones}
          height={220}
          scrollEnabled={false} // Disable scroll so it acts like a clean card, user can open fullscreen elsewhere
          zoomEnabled={false}
        />

        {/* Live Badge Overlay */}
        <View style={styles.liveBadge}>
          <View style={styles.pulsingDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Info Area below the map */}
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Ionicons name="home" size={20} color={lightTheme.colors.primary} style={styles.icon} />
          <View style={styles.textStack}>
            <Text style={styles.addressTitle}>Current Location</Text>
            <Text style={styles.addressText} numberOfLines={2}>
              {location.address || `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}
            </Text>
          </View>
        </View>

        <Divider />

        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={16} color={lightTheme.colors.text.secondary} />
          <Text style={styles.timeText}>{timeString}</Text>
        </View>
      </View>
    </AppCard>
  );
};

// Internal minimal divider to avoid circular dependency issues if we didn't export Divider properly
const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    marginBottom: lightTheme.spacing.lg,
  },
  emptyContainer: {
    padding: lightTheme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  emptyText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
    marginTop: lightTheme.spacing.sm,
  },
  mapWrapper: {
    position: 'relative',
    width: '100%',
    height: 220,
    backgroundColor: lightTheme.colors.surfaceHover,
  },
  liveBadge: {
    position: 'absolute',
    top: lightTheme.spacing.sm,
    left: lightTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: lightTheme.borderRadius.round,
    ...lightTheme.shadows.sm,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightTheme.colors.status.emergency, // Red dot for 'LIVE'
    marginRight: 4,
  },
  liveText: {
    ...lightTheme.typography.caption,
    fontWeight: '700',
    color: lightTheme.colors.text.primary,
  },
  infoContainer: {
    padding: lightTheme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: lightTheme.spacing.md,
  },
  textStack: {
    flex: 1,
  },
  addressTitle: {
    ...lightTheme.typography.body2,
    fontWeight: '600',
    color: lightTheme.colors.text.primary,
    marginBottom: 2,
  },
  addressText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: lightTheme.colors.border,
    marginVertical: lightTheme.spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    marginLeft: 4,
  },
});

export default CurrentLocationCard;
