import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import Avatar from '../../components/common/Avatar';
import AppCard from '../../components/common/AppCard';
import Badge from '../../components/common/Badge';
import Divider from '../../components/common/Divider';
import CurrentLocationCard from '../../components/caregiver/CurrentLocationCard';
import DeviceStatus from '../../components/caregiver/DeviceStatus';
import RoutineStatus from '../../components/caregiver/RoutineStatus';
import EmergencyStatus from '../../components/caregiver/EmergencyStatus';
import SafetyEventCard from '../../components/safety/SafetyEventCard';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { useCaregiver } from '../../hooks/useCaregiver';
import { ROUTES } from '../../constants/routes';
import { lightTheme } from '../../theme';

/**
 * Caregiver's deep-dive profile view for a single tracked child.
 * Routes: ROUTES.CAREGIVER.CHILD_STATUS
 *
 * @param {Object} props
 * @param {Object} props.route.params.childId - ID of the child to display
 */
const ChildProfileScreen = ({ route, navigation }) => {
  const { childId } = route.params || {};
  
  const {
    selectedChildStatus,
    selectedChildEvents,
    isLoading,
    fetchChildDetail,
  } = useCaregiver();

  useEffect(() => {
    if (childId) {
      fetchChildDetail(childId);
    }
  }, [childId]);

  const handleRefresh = useCallback(() => {
    if (childId) fetchChildDetail(childId);
  }, [childId, fetchChildDetail]);

  if (isLoading && !selectedChildStatus) {
    return (
      <SafeAreaWrapper>
        <AppHeader title="Profile" showBack />
        <Loading message="Loading profile..." />
      </SafeAreaWrapper>
    );
  }

  if (!selectedChildStatus) {
    return (
      <SafeAreaWrapper>
        <AppHeader title="Profile" showBack />
        <EmptyState
          icon="person-outline"
          title="Profile Not Found"
          message="Could not load this profile. Please go back and try again."
          buttonText="Go Back"
          onButtonPress={() => navigation.goBack()}
        />
      </SafeAreaWrapper>
    );
  }

  const { profile, safety, devices, currentLocation, currentRoutine } = selectedChildStatus;
  const safeZones = selectedChildStatus?.safeZones || [];

  return (
    <SafeAreaWrapper style={styles.container}>
      <AppHeader 
        title={profile?.name || 'Profile'} 
        showBack
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Header ──────────────────────────────── */}
        <View style={styles.profileHeader}>
          <Avatar 
            name={profile?.name} 
            imageUrl={profile?.avatarUrl} 
            size={72} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.name}</Text>
            {profile?.dateOfBirth && (
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={14} color={lightTheme.colors.text.secondary} />
                <Text style={styles.infoText}>DOB: {profile.dateOfBirth}</Text>
              </View>
            )}
            <Badge 
              label={safety?.isEmergencyActive ? 'Emergency' : safety?.isSafe ? 'Safe' : 'Warning'} 
              status={safety?.isEmergencyActive ? 'emergency' : safety?.isSafe ? 'safe' : 'warning'} 
              style={styles.statusBadge}
            />
          </View>
        </View>

        {/* ── Active Emergency (if any) ───────────────────── */}
        {safety?.isEmergencyActive && safety?.activeEmergency && (
          <EmergencyStatus
            emergency={safety.activeEmergency}
            onResolve={handleRefresh}
            isLoading={isLoading}
          />
        )}

        {/* ── Current Location Map ────────────────────────── */}
        <Text style={styles.sectionTitle}>Live Location</Text>
        <CurrentLocationCard 
          location={currentLocation} 
          safeZones={safeZones} 
        />

        {/* ── Current Routine ─────────────────────────────── */}
        <Text style={styles.sectionTitle}>Current Routine</Text>
        <RoutineStatus 
          currentRoutine={currentRoutine} 
          isOnTrack={safety?.isInsideSafeZone ?? true}
        />

        {/* ── Device Status ────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Wearable Devices</Text>
        <DeviceStatus devices={devices} />

        {/* ── Recent Events Timeline ──────────────────────── */}
        <Text style={styles.sectionTitle}>Recent Events</Text>
        {selectedChildEvents && selectedChildEvents.length > 0 ? (
          <View style={styles.timelineContainer}>
            {selectedChildEvents.slice(0, 5).map((event, index) => (
              <SafetyEventCard
                key={event.id}
                event={event}
                isLast={index === Math.min(selectedChildEvents.length, 5) - 1}
              />
            ))}
          </View>
        ) : (
          <AppCard style={styles.noEventsCard}>
            <View style={styles.noEventsRow}>
              <Ionicons name="checkmark-circle-outline" size={24} color={lightTheme.colors.status.safe} />
              <Text style={styles.noEventsText}>No recent safety events. All is well.</Text>
            </View>
          </AppCard>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {isLoading && <Loading fullScreen />}
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
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    padding: lightTheme.spacing.lg,
    marginBottom: lightTheme.spacing.lg,
    ...lightTheme.shadows.sm,
  },
  avatar: {
    marginRight: lightTheme.spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...lightTheme.typography.h2,
    color: lightTheme.colors.text.primary,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.sm,
  },
  infoText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    marginLeft: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
    marginBottom: lightTheme.spacing.sm,
  },
  timelineContainer: {
    paddingLeft: lightTheme.spacing.xs,
  },
  noEventsCard: {
    marginBottom: lightTheme.spacing.lg,
  },
  noEventsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noEventsText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.primary,
    marginLeft: lightTheme.spacing.sm,
  },
});

export default ChildProfileScreen;
