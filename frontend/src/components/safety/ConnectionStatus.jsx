import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppCard from '../common/AppCard';
import Badge from '../common/Badge';
import { BandConnectionStatus } from '../../types/safety';

/**
 * GPS Band Connection Status Component.
 * Used on the autistic individual's side to show if their wearable is linked.
 *
 * @param {Object} props
 * @param {import('../../types/safety').GPSBandState} props.bandStatus - From useSafetyStore
 * @param {Function} props.onManagePress - Callback to navigate to the Bluetooth pairing screen
 */
const ConnectionStatus = ({ bandStatus, onManagePress }) => {
  const isConnected = bandStatus?.isConnected;
  const isConnecting = bandStatus?.connectionState === BandConnectionStatus.CONNECTING;

  const batteryLevel = bandStatus?.batteryLevel;

  // Determine UI states
  let iconColor = lightTheme.colors.text.tertiary;
  let statusText = 'Disconnected';
  let badgeStatus = 'default';

  if (isConnected) {
    iconColor = lightTheme.colors.primary;
    statusText = 'Connected';
    badgeStatus = 'safe';
  } else if (isConnecting) {
    iconColor = lightTheme.colors.status.warning;
    statusText = 'Reconnecting...';
    badgeStatus = 'warning';
  }

  // Determine battery icon
  const getBatteryIcon = (level) => {
    if (level == null) return 'battery-unknown';
    if (level > 80) return 'battery-full';
    if (level > 40) return 'battery-half';
    return 'battery-dead'; // Technically 'battery-quarter' or similar if using specific ionicons, sticking to basic for safety
  };

  return (
    <AppCard style={styles.card}>
      <View style={styles.mainRow}>

        {/* Left: Icon & Status Text */}
        <View style={styles.statusSection}>
          <View style={[styles.iconCircle, { backgroundColor: isConnected ? lightTheme.colors.primaryLight : lightTheme.colors.surfaceHover }]}>
            <Ionicons name="watch" size={24} color={iconColor} />
          </View>
          <View style={styles.textStack}>
            <Text style={styles.title}>GPS Band</Text>
            <View style={styles.badgeRow}>
              <Badge label={statusText} status={badgeStatus} />
              {isConnected && batteryLevel != null && (
                <View style={styles.batteryWrapper}>
                  <Ionicons name={getBatteryIcon(batteryLevel)} size={14} color={lightTheme.colors.text.secondary} />
                  <Text style={styles.batteryText}>{batteryLevel}%</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Right: Action Button */}
        <TouchableOpacity
          style={styles.manageButton}
          onPress={onManagePress}
          activeOpacity={0.7}
        >
          <Text style={styles.manageText}>
            {isConnected ? 'Manage' : 'Pair'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={lightTheme.colors.primary} />
        </TouchableOpacity>

      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: lightTheme.spacing.md,
    marginBottom: lightTheme.spacing.lg,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: lightTheme.spacing.md,
  },
  textStack: {
    justifyContent: 'center',
  },
  title: {
    ...lightTheme.typography.body1,
    fontWeight: '600',
    color: lightTheme.colors.text.primary,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: lightTheme.spacing.sm,
    backgroundColor: lightTheme.colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  batteryText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    marginLeft: 2,
    fontWeight: '500',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: lightTheme.spacing.sm,
    paddingLeft: lightTheme.spacing.md,
  },
  manageText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.primary,
    fontWeight: '600',
    marginRight: 2,
  },
});

export default ConnectionStatus;
