<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import SOSButton from '../../components/safety/SOSButton';
import BandStatus from '../../components/safety/BandStatus';
import LocationCard from '../../components/safety/LocationCard';
import SafeZoneCard from '../../components/safety/SafeZoneCard';
import EmergencyContactCard from '../../components/safety/EmergencyContactCard';
import { lightTheme } from '../../theme/lightTheme';

const SafetyHomeScreen = () => {
  const handleSOS = () => {
    Alert.alert(
      "SOS Sent",
      "Emergency contacts and caregivers have been notified with your location.",
      [{ text: "OK" }]
    );
  };

  const handleCall = (name) => {
    Alert.alert(`Calling ${name}...`);
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Current Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>🟢 Safe & Monitored</Text>
          </View>
        </View>

        <SOSButton onPress={handleSOS} />
        
        <BandStatus isConnected={true} batteryLevel={85} />
        
        <LocationCard 
          address="123 Example Street, Cityville"
          isTracking={true}
        />
        
        <SafeZoneCard 
          currentZone="Home"
          status="safe" 
        />
        
        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <EmergencyContactCard 
            name="Mom (Sarah)" 
            role="Primary Caregiver" 
            onCall={() => handleCall("Mom")} 
          />
          <EmergencyContactCard 
            name="Dad (John)" 
            role="Secondary Caregiver" 
            onCall={() => handleCall("Dad")} 
          />
        </View>
        
      </ScrollView>
    </SafeAreaWrapper>
=======
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
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  header: {
    paddingHorizontal: lightTheme.spacing.lg,
    paddingTop: lightTheme.spacing.lg,
    paddingBottom: lightTheme.spacing.sm,
  },
  headerTitle: {
    fontSize: lightTheme.typography.size.xxxl,
    fontWeight: lightTheme.typography.weight.bold,
    color: lightTheme.colors.text.primary,
  },
  container: {
    padding: lightTheme.spacing.lg,
    paddingBottom: lightTheme.spacing.huge,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.lg,
  },
  statusLabel: {
    fontSize: lightTheme.typography.size.lg,
    color: lightTheme.colors.text.primary,
    fontWeight: lightTheme.typography.weight.semiBold,
  },
  statusBadge: {
    backgroundColor: lightTheme.colors.status.safeBg,
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.sm,
    borderRadius: lightTheme.borderRadius.md,
  },
  statusBadgeText: {
    color: lightTheme.colors.status.safe,
    fontWeight: lightTheme.typography.weight.bold,
  },
  contactsSection: {
    marginTop: lightTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: lightTheme.typography.size.lg,
    color: lightTheme.colors.text.primary,
    fontWeight: lightTheme.typography.weight.semiBold,
    marginBottom: lightTheme.spacing.md,
  }
=======
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
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
});

export default SafetyHomeScreen;
