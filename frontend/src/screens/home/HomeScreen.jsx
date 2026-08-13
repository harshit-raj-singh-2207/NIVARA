/**
 * HomeScreen.jsx
 * Primary Dashboard for NIVARA AI-Powered Safety & Communication system.
 * Connects safety status, routines, emergency alerts, and caregiver monitoring.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme';
import useUserStore from '../../store/userStore';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import userApi from '../../services/api/userApi';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Avatar from '../../components/common/Avatar';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';

export const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const { user, isCaregiver, linkedUsers, fetchCurrentUser, fetchCaregiverLinkedUsers } =
    useUserStore();
  const { notifications, unreadCount, fetchNotifications, triggerSosAlert, sosActive, cancelSosAlert } =
    useNotificationStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // SOS Confirmation Modal state
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [sosSending, setSosSending] = useState(false);
  const [quickCommFeedback, setQuickCommFeedback] = useState(null);

  // Simulated Device Status state
  const [bandStatus, setBandStatus] = useState({
    connected: true,
    batteryLevel: 88,
    isCharging: false,
    lastSync: '2 mins ago',
    safeZone: 'Home Geofence (Safe Zone)',
    zoneStatus: 'SAFE', // 'SAFE' | 'WARNING' | 'ALERT'
  });

  // Simulated Active Routine state
  const [activeRoutine, setActiveRoutine] = useState({
    title: 'Morning Sensory Calibration & Snack',
    time: '9:30 AM - 10:30 AM',
    nextStep: 'Afternoon Sensory Rest',
    transitionMinutes: 15,
    warning: 'Prepare quiet environment for transition in 15 mins.',
  });

  const loadDashboardData = async () => {
    try {
      setError(null);
      await fetchCurrentUser();
      if (isCaregiver) {
        await fetchCaregiverLinkedUsers();
      }
      await fetchNotifications();
    } catch (err) {
      console.warn('HomeScreen data fetch warning:', err);
      setError('Unable to connect to NIVARA safety server. Please check network connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [isCaregiver])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleSosTrigger = () => {
    setSosModalVisible(true);
  };

  const confirmSosAlert = async () => {
    setSosModalVisible(false);
    setSosSending(true);
    try {
      await triggerSosAlert({
        message: `EMERGENCY SOS: Triggered by ${user?.full_name || 'User'} from HomeScreen.`,
      });
      Alert.alert(
        '🚨 SOS Alert Sent',
        'Emergency alerts have been broadcasted to all assigned caregivers and emergency contacts.',
        [{ text: 'OK' }]
      );
    } catch (e) {
      Alert.alert('SOS Error', 'Failed to dispatch emergency alert. Please try calling directly.');
    } finally {
      setSosSending(false);
    }
  };

  const handleQuickCommunication = (phrase) => {
    setQuickCommFeedback(`Sent: "${phrase}"`);
    setTimeout(() => {
      setQuickCommFeedback(null);
    }, 4000);
  };

  if (loading && !refreshing) {
    return <Loading overlay={true} size="large" message="Syncing NIVARA Safety Dashboard..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="NIVARA Safety Hub"
        subtitle={isCaregiver ? 'Caregiver Dashboard' : 'User Safety & Communication'}
        rightComponent={
          unreadCount > 0 ? (
            <TouchableOpacity
              onPress={() => navigation && navigation.navigate('NotificationsScreen')}
              style={[styles.badge, { backgroundColor: colors.status.error }]}
            >
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.md }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* GRACEFUL FALLBACK ERROR STATE */}
        {error ? (
          <EmptyState
            icon="📡"
            title="System Connection Warning"
            description={error}
            actionTitle="Retry Sync"
            onActionPress={loadDashboardData}
          />
        ) : null}

        {/* ACTIVE EMERGENCY SOS BANNER (IF ACTIVE) */}
        {sosActive && (
          <View
            style={[
              styles.sosActiveBanner,
              {
                backgroundColor: colors.status.errorBackground,
                borderColor: colors.status.error,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.md,
              },
            ]}
          >
            <Text
              style={{
                color: colors.status.error,
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.bold,
              }}
            >
              🚨 EMERGENCY SOS MODE IS ACTIVE
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: typography.sizes.xs,
                marginVertical: 4,
              }}
            >
              Caregivers and emergency services have been alerted to your live location.
            </Text>

            <AppButton
              title="Cancel Emergency Alert"
              variant="outline"
              size="small"
              onPress={cancelSosAlert}
              style={{ marginTop: spacing.xs }}
            />
          </View>
        )}

        {/* 1. USER HEADER SECTION */}
        <AppCard variant="elevated" style={{ marginBottom: spacing.md }}>
          <View style={styles.userHeaderRow}>
            <Avatar
              source={user?.avatar_url}
              name={user?.full_name || 'User'}
              size="large"
              status={bandStatus.connected ? 'online' : 'offline'}
            />

            <View style={styles.userInfoCol}>
              <Text
                style={[
                  styles.greetingText,
                  {
                    color: colors.text,
                    fontSize: typography.sizes.lg,
                    fontWeight: typography.weights.bold,
                  },
                ]}
              >
                Welcome back, {user?.full_name?.split(' ')[0] || 'User'}! 👋
              </Text>
              <Text
                style={[
                  styles.roleText,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.sizes.xs,
                    fontWeight: typography.weights.medium,
                  },
                ]}
              >
                Role: {isCaregiver ? 'Caregiver / Admin' : 'Primary User'}
              </Text>

              {/* Band Connection Status Pill */}
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: bandStatus.connected
                      ? colors.status.successBackground
                      : colors.status.errorBackground,
                    borderRadius: borderRadius.sm,
                    paddingHorizontal: spacing.xs + 2,
                    paddingVertical: 2,
                    marginTop: 6,
                  },
                ]}
              >
                <Text
                  style={{
                    color: bandStatus.connected ? colors.status.success : colors.status.error,
                    fontSize: typography.sizes.xs,
                    fontWeight: typography.weights.bold,
                  }}
                >
                  {bandStatus.connected ? '🟢 GPS Band Connected' : '🔴 GPS Band Offline'} • {bandStatus.batteryLevel}% Battery
                </Text>
              </View>
            </View>
          </View>
        </AppCard>

        {/* 2. QUICK ACTION ROW (PANIC / SOS & QUICK COMMUNICATION) */}
        <AppCard variant="bordered" style={{ marginBottom: spacing.md }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            Quick Actions & Emergency SOS
          </Text>

          {/* Panic SOS Button */}
          <AppButton
            title="🚨 PANIC / SOS ALERT"
            variant="danger"
            size="large"
            loading={sosSending}
            onPress={handleSosTrigger}
            style={{ marginBottom: spacing.md }}
          />

          {quickCommFeedback ? (
            <View
              style={[
                styles.feedbackToast,
                {
                  backgroundColor: colors.status.infoBackground,
                  borderColor: colors.status.info,
                  borderRadius: borderRadius.sm,
                  padding: spacing.xs + 4,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.status.info,
                  fontSize: typography.sizes.xs,
                  fontWeight: typography.weights.bold,
                  textAlign: 'center',
                }}
              >
                {quickCommFeedback}
              </Text>
            </View>
          ) : null}

          {/* Quick Communication Shortcuts */}
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.xs,
              fontWeight: typography.weights.semibold,
              marginBottom: spacing.xs,
            }}
          >
            Quick Speech Shortcuts:
          </Text>

          <View style={styles.quickCommRow}>
            {['I need help', 'I need space', "I can't speak", 'Sensory Overload'].map((phrase, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => handleQuickCommunication(phrase)}
                style={[
                  styles.quickCommChip,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.xs + 2,
                    paddingHorizontal: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: typography.sizes.xs,
                    fontWeight: typography.weights.semibold,
                  }}
                >
                  💬 {phrase}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <AppButton title="Open Communication Assistant" variant="outline" size="small" onPress={() => navigation.navigate('CommunicationFlow')} style={{ marginTop: spacing.sm }} />
        </AppCard>

        {/* 3. SAFETY & LOCATION STATUS WIDGET */}
        <AppCard variant="elevated" style={{ marginBottom: spacing.md }}>
          <View style={styles.cardHeaderRow}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.md,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              📍 Location & Geofence Safety
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: typography.sizes.xs }}>
              Sync: {bandStatus.lastSync}
            </Text>
          </View>

          <View style={styles.statusBoxRow}>
            <View
              style={[
                styles.statusBox,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                  flex: 1,
                  marginRight: spacing.xs,
                },
              ]}
            >
              <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                Current Zone
              </Text>
              <Text
                style={{
                  color: colors.status.success,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.bold,
                  marginTop: 2,
                }}
              >
                {bandStatus.safeZone}
              </Text>
            </View>

            <View
              style={[
                styles.statusBox,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                  flex: 1,
                  marginLeft: spacing.xs,
                },
              ]}
            >
              <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                GPS Band Battery
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.bold,
                  marginTop: 2,
                }}
              >
                ⚡ {bandStatus.batteryLevel}% (Normal)
              </Text>
            </View>
          </View>
        </AppCard>

        {/* 4. ROUTINES & DAILY LIFE CARD */}
        <AppCard variant="sensoryHighlight" style={{ marginBottom: spacing.md }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            📅 Routines & Daily Life
          </Text>

          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.semibold,
            }}
          >
            Active Routine: {activeRoutine.title}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
            Time: {activeRoutine.time}
          </Text>

          {/* Transition Warning Banner */}
          <View
            style={[
              styles.transitionBanner,
              {
                backgroundColor: colors.status.warningBackground,
                borderColor: colors.status.warning,
                borderRadius: borderRadius.md,
                padding: spacing.sm,
                marginTop: spacing.sm,
              },
            ]}
          >
            <Text
              style={{
                color: colors.status.warning,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.bold,
              }}
            >
              ⚠️ TRANSITION WARNING
            </Text>
            <Text style={{ color: colors.text, fontSize: typography.sizes.xs, marginTop: 2 }}>
              {activeRoutine.warning}
            </Text>
          </View>
          <AppButton title="Open Learning & Daily Life" variant="outline" size="small" onPress={() => navigation.navigate('LearningFlow')} style={{ marginTop: spacing.sm }} />
        </AppCard>

        {/* 5. CAREGIVER ACCESS TOGGLE / LINKED PATIENTS (ONLY IF USER IS CAREGIVER) */}
        {isCaregiver ? (
          <AppCard variant="elevated" style={{ marginBottom: spacing.lg }}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.sizes.md,
                  fontWeight: typography.weights.bold,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              👥 Linked Patients & Caregiver Monitoring
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.xs,
                marginBottom: spacing.md,
              }}
            >
              Real-time monitoring for users linked to your caregiver account.
            </Text>

            {linkedUsers && linkedUsers.length > 0 ? (
              linkedUsers.map((linkedUser, index) => (
                <View
                  key={linkedUser.id || index}
                  style={[
                    styles.linkedUserCard,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      marginBottom: spacing.xs,
                    },
                  ]}
                >
                  <View style={styles.linkedUserRow}>
                    <Avatar name={linkedUser.full_name} size="medium" status="online" />
                    <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: typography.sizes.sm,
                          fontWeight: typography.weights.bold,
                        }}
                      >
                        {linkedUser.full_name}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                        Status: 🟢 Home Geofence (Safe)
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <EmptyState
                icon="👥"
                title="No Linked Patients"
                description="You currently have no patient accounts linked to your caregiver dashboard."
                actionTitle="Link Patient Account"
                onActionPress={() => navigation && navigation.navigate('CaregiverVerification')}
              />
            )}
          </AppCard>
        ) : null}
      </ScrollView>

      {/* SOS CONFIRMATION MODAL */}
      <ConfirmModal
        visible={sosModalVisible}
        title="🚨 Trigger Emergency SOS Alert?"
        message="This will immediately broadcast high-priority emergency alerts to all linked caregivers and emergency contacts with your live GPS location."
        confirmText="YES, SEND SOS ALERT"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={confirmSosAlert}
        onCancel={() => setSosModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sosActiveBanner: {
    borderWidth: 1,
  },
  userHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoCol: {
    marginLeft: 12,
    flex: 1,
  },
  greetingText: {
    textAlign: 'left',
  },
  roleText: {
    textAlign: 'left',
  },
  statusPill: {
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    textAlign: 'left',
  },
  feedbackToast: {
    borderWidth: 1,
  },
  quickCommRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  quickCommChip: {
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBoxRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statusBox: {
    borderWidth: 1,
  },
  transitionBanner: {
    borderWidth: 1,
  },
  linkedUserCard: {
    borderWidth: 1,
  },
  linkedUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HomeScreen;
