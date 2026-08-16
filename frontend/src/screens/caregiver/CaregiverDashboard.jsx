import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import ChildStatusCard from '../../components/caregiver/ChildStatusCard';
import EmergencyStatus from '../../components/caregiver/EmergencyStatus';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import { useCaregiver } from '../../hooks/useCaregiver';
import { ROUTES } from '../../constants/routes';
import { lightTheme } from '../../theme';

/**
 * Caregiver's primary landing screen.
 * Shows a glanceable list of all children/individuals being tracked.
 * Any active emergencies are surfaced at the very top.
 */
const CaregiverDashboard = ({ navigation }) => {
  const { 
    dashboardSummary,
    isLoading,
    error,
    loadDashboard,
    selectChild,
  } = useCaregiver();

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleChildPress = useCallback(async (childId) => {
    await selectChild(childId);
    navigation.navigate(ROUTES.CAREGIVER.CHILD_STATUS, { childId });
  }, [selectChild, navigation]);

  // Derive a flat list of children from the dashboard summary
  const children = dashboardSummary?.children || [];

  // Separate out anyone with active emergencies for top-section surfacing
  const activeEmergencies = children.filter(
    (c) => c.status?.safety?.isEmergencyActive
  );

  const renderChild = useCallback(({ item }) => (
    <ChildStatusCard
      child={item.profile}
      status={item.status}
      onPress={() => handleChildPress(item.profile.id)}
    />
  ), [handleChildPress]);

  const keyExtractor = useCallback((item) => item.profile.id, []);

  // Custom greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading && !dashboardSummary) {
    return (
      <SafeAreaWrapper style={styles.container}>
        <Loading message="Loading your dashboard..." />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <FlatList
        data={children}
        keyExtractor={keyExtractor}
        renderItem={renderChild}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadDashboard}
            tintColor={lightTheme.colors.primary}
            colors={[lightTheme.colors.primary]}
          />
        }
        ListHeaderComponent={
          <>
            {/* ── Top Bar: Greeting & Notification Icon ────── */}
            <View style={styles.topBar}>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>{getGreeting()},</Text>
                <Text style={styles.caregiverName}>
                  {dashboardSummary?.caregiverName || 'Caregiver'}
                </Text>
              </View>

              {/* Notification button (placeholder, Part 3 will wire this) */}
              <View style={styles.topBarActions}>
                {activeEmergencies.length > 0 && (
                  <Badge 
                    label={`${activeEmergencies.length} Alert`}
                    status="emergency"
                    style={styles.alertBadge}
                  />
                )}
              </View>
            </View>

            {/* ── Active Emergency Banners (top priority) ────── */}
            {activeEmergencies.length > 0 && (
              <View style={styles.emergencySection}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="warning" size={20} color={lightTheme.colors.status.emergency} />
                  <Text style={[styles.sectionTitle, styles.emergencyTitle]}>
                    Active Emergencies
                  </Text>
                </View>
                {activeEmergencies.map(c => (
                  <EmergencyStatus
                    key={c.profile.id}
                    emergency={c.status?.safety?.activeEmergency}
                    onResolve={() => handleChildPress(c.profile.id)}
                    isLoading={false}
                  />
                ))}
              </View>
            )}

            {/* ── Children Section Title ────────────────────── */}
            <View style={styles.sectionTitleRow}>
              <Ionicons name="people" size={20} color={lightTheme.colors.text.primary} />
              <Text style={styles.sectionTitle}>
                Monitored Individuals
                {children.length > 0 && (
                  <Text style={styles.countText}>{` (${children.length})`}</Text>
                )}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="people-outline"
              title="No Individuals Linked"
              message="You haven't been added as a caregiver to any profiles yet. Ask a user to invite you from their Safety settings."
            />
          ) : null
        }
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  listContent: {
    padding: lightTheme.spacing.md,
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: lightTheme.spacing.xl,
    paddingTop: lightTheme.spacing.sm,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
  },
  caregiverName: {
    ...lightTheme.typography.h2,
    color: lightTheme.colors.text.primary,
    fontWeight: '700',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertBadge: {
    marginLeft: lightTheme.spacing.sm,
  },
  emergencySection: {
    marginBottom: lightTheme.spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.md,
  },
  sectionTitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
    marginLeft: lightTheme.spacing.sm,
  },
  emergencyTitle: {
    color: lightTheme.colors.status.emergency,
  },
  countText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.secondary,
    fontWeight: '400',
  },
});

export default CaregiverDashboard;
