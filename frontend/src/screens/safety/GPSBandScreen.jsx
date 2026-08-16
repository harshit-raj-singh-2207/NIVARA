import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import ConnectionStatus from '../../components/safety/ConnectionStatus';
import AppButton from '../../components/common/AppButton';
import Loading from '../../components/common/Loading';
import Divider from '../../components/common/Divider';
import Badge from '../../components/common/Badge';
import { useBluetooth } from '../../hooks/useBluetooth';
import { lightTheme } from '../../theme';

/**
 * GPS Band pairing and management screen.
 * Shows current connection status, allows scanning for new devices, and pairing.
 */
const GPSBandScreen = ({ navigation }) => {
  const { 
    bandStatus,
    isScanning,
    scanError,
    discoveredDevices,
    startScan,
    stopScan,
    connectToBand,
    disconnectBand,
  } = useBluetooth();

  // Stop scan when navigating away
  useEffect(() => {
    return () => stopScan();
  }, [stopScan]);

  const handleDisconnect = useCallback(async () => {
    await disconnectBand();
  }, [disconnectBand]);

  const renderDeviceItem = useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.deviceItem}
      onPress={() => connectToBand(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.deviceIcon}>
        <Ionicons name="watch-outline" size={24} color={lightTheme.colors.primary} />
      </View>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
        <Text style={styles.deviceId} numberOfLines={1}>{item.id}</Text>
      </View>
      <Badge 
        label={item.rssi ? `${item.rssi} dBm` : 'Near'} 
        status={bandStatus.deviceId === item.id ? 'safe' : 'default'} 
      />
    </TouchableOpacity>
  ), [connectToBand, bandStatus.deviceId]);

  return (
    <SafeAreaWrapper style={styles.container}>
      <AppHeader title="GPS Band" showBack />

      <FlatList
        data={discoveredDevices}
        keyExtractor={(item) => item.id}
        renderItem={renderDeviceItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Current Status Card */}
            <ConnectionStatus 
              bandStatus={bandStatus}
              onManagePress={() => {}} // Already on this screen
            />

            {/* Connected Device: Disconnect Option */}
            {bandStatus.isConnected && (
              <View style={styles.connectedSection}>
                <View style={styles.connectedRow}>
                  <Ionicons name="checkmark-circle" size={20} color={lightTheme.colors.status.safe} />
                  <Text style={styles.connectedText}>
                    Band is actively paired and tracking.
                  </Text>
                </View>
                <AppButton 
                  title="Disconnect Band"
                  variant="outline"
                  onPress={handleDisconnect}
                  style={styles.disconnectButton}
                />
              </View>
            )}

            <Divider label="Find Nearby Devices" marginVertical={lightTheme.spacing.lg} />

            {/* Scan Control */}
            <AppButton
              title={isScanning ? 'Stop Scanning...' : 'Scan for GPS Bands'}
              variant={isScanning ? 'secondary' : 'primary'}
              leftIcon={isScanning ? 'stop-circle-outline' : 'bluetooth'}
              onPress={isScanning ? stopScan : startScan}
              isLoading={false}
            />

            {/* Scanning Indicator */}
            {isScanning && (
              <View style={styles.scanningInfo}>
                <Ionicons name="radio-outline" size={18} color={lightTheme.colors.primary} />
                <Text style={styles.scanningText}>Scanning nearby BLE devices...</Text>
              </View>
            )}

            {/* Error */}
            {scanError && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={lightTheme.colors.status.emergency} />
                <Text style={styles.errorText}>{scanError}</Text>
              </View>
            )}

            {/* Device List Header */}
            {discoveredDevices.length > 0 && (
              <Text style={styles.foundLabel}>
                Found {discoveredDevices.length} device{discoveredDevices.length !== 1 ? 's' : ''}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !isScanning ? (
            <View style={styles.emptyDevices}>
              <Ionicons name="bluetooth-outline" size={40} color={lightTheme.colors.text.tertiary} />
              <Text style={styles.emptyText}>
                {isScanning ? 'Searching...' : 'No devices found yet. Tap Scan to begin.'}
              </Text>
            </View>
          ) : null
        }
      />

      {/* Full Screen loading overlay when connecting */}
      {bandStatus.connectionState === 'connecting' && (
        <Loading fullScreen message={`Connecting to band…`} />
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  scrollContent: {
    padding: lightTheme.spacing.md,
    flexGrow: 1,
  },
  connectedSection: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.md,
    marginBottom: lightTheme.spacing.md,
    borderWidth: 1,
    borderColor: lightTheme.colors.status.safe,
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  connectedText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.status.safe,
    fontWeight: '600',
    marginLeft: lightTheme.spacing.sm,
  },
  disconnectButton: {
    borderColor: lightTheme.colors.status.emergency,
  },
  scanningInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: lightTheme.spacing.sm,
    marginTop: lightTheme.spacing.sm,
  },
  scanningText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.primary,
    marginLeft: lightTheme.spacing.sm,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.status.emergencyBg,
    borderRadius: lightTheme.borderRadius.md,
    padding: lightTheme.spacing.md,
    marginTop: lightTheme.spacing.md,
  },
  errorText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.status.emergency,
    marginLeft: lightTheme.spacing.sm,
    flex: 1,
  },
  foundLabel: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
    marginTop: lightTheme.spacing.lg,
    marginBottom: lightTheme.spacing.sm,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.md,
    marginTop: lightTheme.spacing.sm,
    ...lightTheme.shadows.sm,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: lightTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: lightTheme.spacing.md,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    ...lightTheme.typography.body1,
    fontWeight: '700',
    color: lightTheme.colors.text.primary,
  },
  deviceId: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    marginTop: 2,
  },
  emptyDevices: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: lightTheme.spacing.xl,
    marginTop: lightTheme.spacing.xl,
  },
  emptyText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
    textAlign: 'center',
    marginTop: lightTheme.spacing.md,
  },
});

export default GPSBandScreen;
