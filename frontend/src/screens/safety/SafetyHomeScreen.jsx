/**
 * SafetyHomeScreen.jsx
 * Complete, production-grade Live GPS Safety Tracking, Band Connectivity & Emergency SOS Screen for NIVARA.
 * Connects BLE Smart Wearable status, live satellite GPS location, geofence boundaries, and hold-to-confirm SOS.
 */

import React, { useEffect } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme';
import { BRAND_COLORS, STATUS_COLORS } from '../../constants/colors';
import useSafetyStore from '../../store/safetyStore';
import safetyApi from '../../services/api/safetyApi';
import bandConnection from '../../services/bluetooth/bandConnection';
import locationService from '../../services/location/locationService';
import { requestLocationPermission } from '../../utils/permissionUtils';
import { handleApiError, showSuccessAlert } from '../../utils/errorHandler';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

import SOSButton from '../../components/safety/SOSButton';
import LocationCard from '../../components/safety/LocationCard';
import MapView from '../../components/safety/MapView';
import SafeZoneCard from '../../components/safety/SafeZoneCard';
import BandStatus from '../../components/safety/BandStatus';
import ConnectionStatus from '../../components/safety/ConnectionStatus';
import EmergencyContactCard from '../../components/safety/EmergencyContactCard';

export const SafetyHomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const {
    location,
    bandState,
    safeZones,
    emergencyContacts,
    isSosTriggered,
    isLoading,
    fetchSafetyOverview,
    triggerEmergencySOS,
    updateLocation,
  } = useSafetyStore();

  useEffect(() => {
    // Check background location permissions on screen load
    requestLocationPermission();

    fetchSafetyOverview();

    // Subscribe to live GPS updates
    const unsubscribeLocation = locationService.subscribeLocation((newLoc) => {
      updateLocation(newLoc);
    });

    return () => unsubscribeLocation();
  }, []);

  const handleRefresh = () => {
    fetchSafetyOverview();
  };

  const handleSOSConfirm = async () => {
    try {
      await triggerEmergencySOS();
      showSuccessAlert(
        '🚨 EMERGENCY SOS DISPATCHED',
        'Multi-channel alerts, live GPS location, and SMS warnings sent to all linked caregivers.'
      );
    } catch (err) {
      handleApiError(err, 'SOS Dispatch Failed');
    }
  };

  const handlePairBandPress = () => {
    if (navigation) {
      navigation.navigate('GPSBandScreen');
    } else {
      Alert.alert('⌚ Smart Band Pair', 'Initiating Bluetooth BLE scan for NIVARA Wearables...');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Safety & GPS Tracking"
        subtitle="Wearable Band & Geofence Protection"
        showBack={true}
        onBackPress={() => (navigation ? navigation.goBack() : null)}
      />

      {isLoading && <Loading overlay={true} size="large" message="Syncing GPS satellite radar & band telemetry..." />}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* 1. BAND CONNECTION & BATTERY BAR */}
        <AppCard variant="elevated" style={[shadows.small, { marginBottom: spacing.lg }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            ⌚ NIVARA Smart Wearable Band Status
          </Text>

          <ConnectionStatus
            isConnected={bandState?.isConnected}
            deviceName={bandState?.deviceName}
            onPairPress={handlePairBandPress}
          />

          <View style={{ marginTop: spacing.xs }}>
            <BandStatus
              batteryLevel={bandState?.batteryLevel}
              signalStrength={bandState?.signalStrength}
              isSeparated={bandState?.isSeparated}
            />
          </View>
        </AppCard>

        {/* 2. QUICK EMERGENCY SOS TRIGGER BUTTON */}
        <AppCard variant="sensoryHighlight" style={{ marginBottom: spacing.lg, alignItems: 'center' }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.bold,
              },
            ]}
          >
            🚨 Emergency Panic Trigger
          </Text>

          <SOSButton
            isTriggered={isSosTriggered}
            onHoldConfirm={handleSOSConfirm}
          />
        </AppCard>

        {/* 3. INTERACTIVE MAP & LIVE LOCATION SECTION */}
        <AppCard variant="bordered" style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            📍 Live Satellite GPS & Safe Zone Radar
          </Text>

          {/* Location Address Card */}
          <LocationCard location={location} />

          {/* Embedded Map Viewer Component */}
          <MapView location={location} safeZones={safeZones} style={{ marginBottom: spacing.md }} />

          {/* Safe Zone Geofence Cards */}
          <View style={styles.geofenceHeaderRow}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.bold,
              }}
            >
              Active Safe Zone Boundaries:
            </Text>
            <TouchableOpacity onPress={() => (navigation ? navigation.navigate('SafeZonesScreen') : null)}>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: 'bold' }}>
                Manage Zones ›
              </Text>
            </TouchableOpacity>
          </View>

          {safeZones.map((zoneItem) => (
            <SafeZoneCard
              key={zoneItem.id}
              zone={zoneItem}
              onPress={() => (navigation ? navigation.navigate('SafeZonesScreen') : null)}
            />
          ))}
        </AppCard>

        {/* 4. EMERGENCY CONTACTS LIST */}
        <AppCard variant="elevated" style={[shadows.small, { marginBottom: spacing.xl }]}>
          <View style={styles.geofenceHeaderRow}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              📞 Registered Emergency Caregivers
            </Text>
            <TouchableOpacity onPress={() => (navigation ? navigation.navigate('EmergencyContactsScreen') : null)}>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: 'bold' }}>
                Edit Contacts ›
              </Text>
            </TouchableOpacity>
          </View>

          {emergencyContacts.map((contactItem) => (
            <EmergencyContactCard
              key={contactItem.id}
              contact={contactItem}
            />
          ))}
        </AppCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    textAlign: 'left',
  },
  geofenceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default SafetyHomeScreen;
