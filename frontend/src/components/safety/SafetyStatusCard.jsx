import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppCard from '../common/AppCard';
import Badge from '../common/Badge';
import { EmergencyStatus } from '../../types/safety';

/**
 * High-level Safety Status display card.
 * Used on the Caregiver Dashboard to summarize a child's current state.
 *
 * @param {Object} props
 * @param {import('../../types/caregiver').CaregiverStatusSummary} props.statusData 
 * @param {Function} [props.onPress] - Navigation handler for drilling down
 */
const SafetyStatusCard = ({ statusData, onPress }) => {
  // Graceful fallback for loading states
  if (!statusData) {
    return (
      <AppCard onPress={onPress}>
        <Text style={styles.loadingText}>Loading status...</Text>
      </AppCard>
    );
  }

  const { safety, currentLocation, devices } = statusData;

  // Determine Primary Status Configuration
  let mainStatusText = 'Safe and Secure';
  let badgeStatus = 'safe';
  let iconName = 'checkmark-circle';
  let iconColor = lightTheme.colors.status.safe;
  let surfaceColor = lightTheme.colors.surface;

  if (safety?.isEmergencyActive) {
    mainStatusText = 'Emergency Active';
    badgeStatus = 'emergency';
    iconName = 'warning';
    iconColor = lightTheme.colors.status.emergency;
    surfaceColor = lightTheme.colors.status.emergencyBg;
  } else if (!safety?.isSafe || !safety?.isBandConnected) {
    mainStatusText = 'Attention Required';
    badgeStatus = 'warning';
    iconName = 'alert-circle';
    iconColor = lightTheme.colors.status.warning;
    surfaceColor = lightTheme.colors.status.warningBg;
  }

  // Find the primary GPS band to show battery if available
  const band = devices?.find(d => d.type === 'gps_band');

  return (
    <AppCard 
      onPress={onPress} 
      style={[styles.card, { backgroundColor: surfaceColor }]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name={iconName} size={28} color={iconColor} style={styles.mainIcon} />
          <Text style={styles.title}>{mainStatusText}</Text>
        </View>
        <Badge label={badgeStatus === 'safe' ? 'Safe' : badgeStatus} status={badgeStatus} />
      </View>

      <View style={styles.detailsContainer}>
        
        {/* Location Row */}
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={18} color={lightTheme.colors.text.secondary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {safety?.isInsideSafeZone && safety?.currentZoneName 
              ? `At ${safety.currentZoneName}` 
              : (currentLocation?.address || 'Location tracking active')}
          </Text>
        </View>

        {/* GPS Band Row */}
        <View style={styles.detailRow}>
          <Ionicons 
            name={safety?.isBandConnected ? 'watch-outline' : 'watch'} 
            size={18} 
            color={safety?.isBandConnected ? lightTheme.colors.text.secondary : lightTheme.colors.status.warning} 
          />
          <Text style={[styles.detailText, !safety?.isBandConnected && styles.warningText]}>
            {safety?.isBandConnected 
              ? `Band Connected ${band?.batteryLevel ? `(${band.batteryLevel}%)` : ''}` 
              : 'Band Disconnected'}
          </Text>
        </View>
        
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: lightTheme.spacing.lg,
  },
  loadingText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: lightTheme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mainIcon: {
    marginRight: lightTheme.spacing.sm,
  },
  title: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
  },
  detailsContainer: {
    marginTop: lightTheme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.sm,
  },
  detailText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.primary,
    marginLeft: lightTheme.spacing.sm,
    flex: 1,
  },
  warningText: {
    color: lightTheme.colors.status.warning,
    fontWeight: '500',
  },
});

export default SafetyStatusCard;
