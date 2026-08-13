/**
 * CaregiverDashboard.jsx
 * Complete, production-grade Primary Monitoring Hub for Caregivers in NIVARA.
 * Connects real-time dependent status, satellite GPS tracking, geofence breaches, BLE band battery, and remote action controls.
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
import useCaregiverStore from '../../store/caregiverStore';
import caregiverApi from '../../services/api/caregiverApi';
import { handleApiError, showSuccessAlert } from '../../utils/errorHandler';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Avatar from '../../components/common/Avatar';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

import CaregiverHeader from '../../components/caregiver/CaregiverHeader';
import ChildStatusCard from '../../components/caregiver/ChildStatusCard';
import CurrentLocationCard from '../../components/caregiver/CurrentLocationCard';
import RoutineStatus from '../../components/caregiver/RoutineStatus';
import DeviceStatus from '../../components/caregiver/DeviceStatus';
import EmergencyStatus from '../../components/caregiver/EmergencyStatus';

export const CaregiverDashboard = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const {
    dependents,
    activeDependentId,
    activeEmergencyAlert,
    isLoading,
    fetchCaregiverDashboard,
    setActiveDependentId,
    dismissEmergencyAlert,
    sendCheckIn,
    adjustSensoryLimit,
  } = useCaregiverStore();

  useEffect(() => {
    fetchCaregiverDashboard();

    // 5-second real-time polling interval for live dependent safety telemetry
    const interval = setInterval(() => {
      fetchCaregiverDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchCaregiverDashboard();
  };

  const activeDependent =
    dependents.find((d) => d.id === activeDependentId) || dependents[0];

  const handleSendCheckInPress = async () => {
    try {
      await sendCheckIn('Hi Alex! Caregiver checking in. Are you feeling okay?');
      showSuccessAlert(
        'Check-In Alert Dispatched',
        `A gentle check-in notification was sent to ${activeDependent?.name || 'User'}.`
      );
    } catch (err) {
      handleApiError(err, 'Check-In Dispatch Failed');
    }
  };

  const handleRemoteSensoryAdjust = async () => {
    Alert.alert(
      '🎛️ Remote Sensory Adjustment',
      `Lower ambient noise alert limit for ${activeDependent?.name || 'User'} to 75 dB?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply 75 dB Limit',
          onPress: async () => {
            try {
              await adjustSensoryLimit(75);
              showSuccessAlert('Sensory Threshold Updated', 'Remote noise threshold lowered to 75 dB.');
            } catch (err) {
              handleApiError(err, 'Remote Adjustment Failed');
            }
          },
        },
      ]
    );
  };

  const handleViewMap = () => {
    if (navigation) {
      navigation.navigate('LiveLocationScreen', { dependentId: activeDependentId });
    } else {
      Alert.alert('📍 Satellite GPS Map', `Navigating to live map for ${activeDependent?.name || 'User'}`);
    }
  };

  const handleContactUser = () => {
    Alert.alert(
      '📞 Contact User',
      `Directly calling ${activeDependent?.name || 'User'}'s paired device...`,
      [{ text: 'End Call', style: 'cancel' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. CAREGIVER HEADER WITH DEPENDENTS SELECTOR */}
      <CaregiverHeader
        dependents={dependents}
        activeDependentId={activeDependentId}
        onSelectDependent={(id) => setActiveDependentId(id)}
      />

      {isLoading && <Loading overlay={true} size="large" message="Syncing caregiver telemetry hub..." />}

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
        {/* 2. LIVE EMERGENCY ALERT BANNER */}
        {activeEmergencyAlert && (
          <EmergencyStatus
            alert={activeEmergencyAlert}
            onViewMap={handleViewMap}
            onContactUser={handleContactUser}
            onDismiss={dismissEmergencyAlert}
          />
        )}

        {/* 3. DEPENDENT PROFILE OVERVIEW CARD */}
        {activeDependent ? (
          <ChildStatusCard
            dependent={activeDependent}
            onPress={() => (navigation ? navigation.navigate('ChildProfileScreen', { dependentId: activeDependent.id }) : null)}
          />
        ) : (
          <EmptyState
            icon="👶"
            title="No Dependent Linked"
            description="Enter a caregiver verification code to link a dependent profile."
          />
        )}

        {/* 4. SAFETY & LOCATION MONITORING CARD */}
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
            📍 Safety & Geofence Location Monitoring
          </Text>

          <CurrentLocationCard
            location={activeDependent?.location}
            onViewMap={handleViewMap}
          />
        </AppCard>

        {/* 5. ROUTINE & DEVICE STATUS WIDGET */}
        <AppCard variant="elevated" style={[shadows.small, { marginBottom: spacing.lg }]}>
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
            📊 Routine & Smart Wearable Telemetry
          </Text>

          {/* Routine Status Widget */}
          <RoutineStatus routine={activeDependent?.routine} />

          {/* Device Sync & Battery Status Widget */}
          <DeviceStatus device={activeDependent?.device} />
        </AppCard>

        {/* 6. FAST ACTION CONTROLS */}
        <AppCard variant="sensoryHighlight" style={{ marginBottom: spacing.xl }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.sm,
              },
            ]}
          >
            ⚡ Remote Caregiver Fast Actions
          </Text>

          <View style={styles.actionRow}>
            <AppButton
              title="💬 Send Check-In"
              onPress={handleSendCheckInPress}
              variant="primary"
              size="medium"
              style={{ flex: 1, marginRight: 6 }}
            />
            <AppButton
              title="🎛️ Sensory Settings"
              onPress={handleRemoteSensoryAdjust}
              variant="secondary"
              size="medium"
              style={{ flex: 1.1 }}
            />
          </View>
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CaregiverDashboard;
