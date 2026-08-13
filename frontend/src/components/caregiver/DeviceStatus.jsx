import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppCard from '../common/AppCard';

/**
 * Caregiver UI Component.
 * Displays the status of devices (GPS bands/phones) attached to a specific child.
 * Good for identifying if a band is dead or offline.
 *
 * @param {Object} props
 * @param {import('../../types/caregiver').DeviceInfo[]} [props.devices=[]] 
 */
const DeviceStatus = ({ devices = [] }) => {

  if (!devices || devices.length === 0) {
    return (
      <AppCard style={styles.card}>
        <View style={styles.emptyContainer}>
          <Ionicons name="hardware-chip-outline" size={32} color={lightTheme.colors.text.tertiary} />
          <Text style={styles.emptyText}>No paired devices found.</Text>
        </View>
      </AppCard>
    );
  }

  // Determine battery icon
  const getBatteryIcon = (level) => {
    if (level == null) return 'battery-unknown';
    if (level > 80) return 'battery-full';
    if (level > 40) return 'battery-half';
    if (level > 15) return 'battery-quarter';
    return 'battery-dead';
  };

  return (
    <AppCard style={styles.card} noPadding>
      <View style={styles.header}>
        <Ionicons name="watch-outline" size={20} color={lightTheme.colors.primary} />
        <Text style={styles.headerTitle}>Active Wearables</Text>
      </View>

      <View style={styles.listContainer}>
        {devices.map((device, index) => {
          const isConnected = device.connectionStatus === 'connected';
          const isCritical = device.batteryLevel != null && device.batteryLevel <= 15;
          const isLast = index === devices.length - 1;

          return (
            <View key={device.id} style={[styles.deviceRow, !isLast && styles.borderBottom]}>

              {/* Device Main Info */}
              <View style={styles.deviceInfoContainer}>
                <Text style={styles.deviceName}>{device.name}</Text>

                <View style={styles.subtitleRow}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: isConnected ? lightTheme.colors.status.safe : lightTheme.colors.status.warning }
                  ]} />
                  <Text style={styles.subtitleText}>
                    {isConnected ? 'Connected' : 'Offline'}
                  </Text>
                </View>
              </View>

              {/* Battery Info */}
              {device.batteryLevel != null && (
                <View style={[
                  styles.batteryBadge,
                  isCritical && styles.batteryCriticalBadge
                ]}>
                  <Ionicons
                    name={getBatteryIcon(device.batteryLevel)}
                    size={16}
                    color={isCritical ? lightTheme.colors.status.emergency : lightTheme.colors.text.secondary}
                  />
                  <Text style={[
                    styles.batteryText,
                    isCritical && styles.batteryCriticalText
                  ]}>
                    {device.batteryLevel}%
                  </Text>
                </View>
              )}

            </View>
          );
        })}
      </View>
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
  },
  listContainer: {
    paddingHorizontal: lightTheme.spacing.md,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: lightTheme.spacing.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  deviceInfoContainer: {
    flex: 1,
  },
  deviceName: {
    ...lightTheme.typography.body1,
    fontWeight: '600',
    color: lightTheme.colors.text.primary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  subtitleText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
  },
  batteryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.surfaceHover,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  batteryText: {
    ...lightTheme.typography.body2,
    fontWeight: '600',
    color: lightTheme.colors.text.secondary,
    marginLeft: 4,
  },
  batteryCriticalBadge: {
    backgroundColor: lightTheme.colors.status.emergencyBg,
  },
  batteryCriticalText: {
    color: lightTheme.colors.status.emergency,
  }
});

export default DeviceStatus;
