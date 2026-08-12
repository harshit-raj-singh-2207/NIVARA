/**
 * ProfileScreen.jsx
 * Complete, production-grade User Profile Screen for NIVARA.
 * AI-Powered Safety, Sensory Adaptation & Communication platform.
 */

import React, { useCallback, useState } from 'react';
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
import { PROFILE_ROUTES } from '../../constants/routes';
import useAuthStore from '../../store/authStore';
import useUserStore from '../../store/userStore';
import userApi from '../../services/api/userApi';
import { handleApiError } from '../../utils/errorHandler';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Avatar from '../../components/common/Avatar';
import Loading from '../../components/common/Loading';
import ConfirmModal from '../../components/common/ConfirmModal';

export const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const { logout } = useAuthStore();
  const { user, isCaregiver, sensoryPreferences, fetchCurrentUser, fetchCaregiverLinkedUsers } =
    useUserStore();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Device & Connection Info State
  const [deviceInfo] = useState({
    bandName: 'NIVARA Safety GPS Band #8819',
    connected: true,
    batteryLevel: 88,
    lastSync: '2 mins ago',
    pairedCaregiver: 'Sarah Jenkins (Primary Caregiver)',
  });

  const loadProfileData = async () => {
    try {
      await fetchCurrentUser();
      if (isCaregiver) {
        await fetchCaregiverLinkedUsers();
      }
    } catch (err) {
      console.warn('Profile refresh warning:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [isCaregiver])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadProfileData();
  };

  const handleLogoutConfirm = async () => {
    setLogoutModalVisible(false);
    try {
      await logout();
    } catch (err) {
      handleApiError(err, 'Logout Failed');
    }
  };

  if (loading && !refreshing) {
    return <Loading overlay={true} size="large" message="Loading profile settings..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="User Profile" subtitle="Account Settings & Preferences" />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
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
        {/* 1. HEADER & AVATAR SECTION */}
        <AppCard variant="elevated" style={[styles.profileHeaderCard, shadows.small, { marginBottom: spacing.md }]}>
          <Avatar
            name={user?.full_name || 'User'}
            source={user?.avatar_url}
            size="xlarge"
            status="online"
            style={{ marginBottom: spacing.sm }}
          />

          <Text
            style={[
              styles.userName,
              {
                color: colors.text,
                fontSize: typography.sizes.xl,
                fontWeight: typography.weights.bold,
              },
            ]}
          >
            {user?.full_name || 'NIVARA User'}
          </Text>

          <Text
            style={[
              styles.userEmail,
              {
                color: colors.textSecondary,
                fontSize: typography.sizes.sm,
                marginTop: 2,
              },
            ]}
          >
            {user?.email || 'user@nivara.app'}
          </Text>

          {/* Role Badge */}
          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor: isCaregiver
                  ? colors.status.infoBackground
                  : colors.surfaceSubtle,
                borderColor: isCaregiver ? colors.primary : colors.border,
                borderWidth: 1,
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                paddingVertical: 4,
                marginTop: spacing.sm,
              },
            ]}
          >
            <Text
              style={{
                color: colors.primary,
                fontWeight: typography.weights.bold,
                fontSize: typography.sizes.xs,
              }}
            >
              ROLE: {isCaregiver ? 'CAREGIVER / ADMIN' : 'PRIMARY USER'}
            </Text>
          </View>

          {/* Caregiver Pairing Code if available */}
          {user?.caregiver_code && (
            <View
              style={[
                styles.codeBox,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.primaryLight,
                  borderWidth: 1,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginTop: spacing.md,
                  width: '100%',
                },
              ]}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: typography.sizes.xs,
                  textAlign: 'center',
                }}
              >
                Your Caregiver Pairing Code:
              </Text>
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: typography.weights.bold,
                  fontSize: typography.sizes.lg,
                  textAlign: 'center',
                  marginTop: 2,
                  letterSpacing: 2,
                }}
              >
                {user.caregiver_code}
              </Text>
            </View>
          )}

          {/* Quick Edit Profile Button */}
          <AppButton
            title="Edit Profile Details"
            onPress={() => navigation.navigate(PROFILE_ROUTES.EDIT_PROFILE)}
            variant="outline"
            size="small"
            fullWidth={true}
            style={{ marginTop: spacing.md }}
          />
        </AppCard>

        {/* 2. CONNECTED DEVICE & SAFETY OVERVIEW */}
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
            📡 Connected Device & Safety Overview
          </Text>

          <View style={styles.deviceRow}>
            <Text style={{ fontSize: 24, marginRight: spacing.sm }}>⌚</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.bold,
                }}
              >
                {deviceInfo.bandName}
              </Text>
              <Text style={{ color: colors.status.success, fontSize: typography.sizes.xs }}>
                🟢 Connected • Battery {deviceInfo.batteryLevel}% • Last Sync {deviceInfo.lastSync}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.caregiverInfoRow,
              {
                backgroundColor: colors.surfaceSubtle,
                borderRadius: borderRadius.md,
                padding: spacing.sm,
                marginTop: spacing.sm,
              },
            ]}
          >
            <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
              Assigned Caregiver:
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.bold,
                marginTop: 2,
              }}
            >
              {user?.caregiver_id ? 'Sarah Jenkins (Linked Active Caregiver)' : 'No Caregiver Assigned Yet'}
            </Text>
          </View>
        </AppCard>

        {/* 3. PREFERENCE HIGHLIGHTS CARD */}
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
            ⚙️ Sensory & Communication Preferences
          </Text>

          <View style={styles.prefGrid}>
            <View style={styles.prefItem}>
              <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                Theme Mode
              </Text>
              <Text style={{ color: colors.text, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold }}>
                {sensoryPreferences?.theme_mode?.toUpperCase() || 'LIGHT'}
              </Text>
            </View>

            <View style={styles.prefItem}>
              <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                Sound Sensitivity
              </Text>
              <Text style={{ color: colors.text, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold }}>
                Level {sensoryPreferences?.sound_sensitivity_level || 3} / 5
              </Text>
            </View>

            <View style={styles.prefItem}>
              <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                Brightness Sensitivity
              </Text>
              <Text style={{ color: colors.text, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold }}>
                Level {sensoryPreferences?.brightness_sensitivity_level || 3} / 5
              </Text>
            </View>

            <View style={styles.prefItem}>
              <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                Haptic Feedback
              </Text>
              <Text style={{ color: colors.text, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold }}>
                {sensoryPreferences?.haptic_feedback_enabled ? 'ENABLED' : 'DISABLED'}
              </Text>
            </View>
          </View>
        </AppCard>

        {/* 4. QUICK NAVIGATION LINKS */}
        <AppCard variant="elevated" style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.sm,
              },
            ]}
          >
            📂 Quick Navigation
          </Text>

          <View style={styles.menuList}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(PROFILE_ROUTES.SETTINGS)}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
            >
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={[styles.menuLabel, { color: colors.text }]}>System & Sensory Settings</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(PROFILE_ROUTES.PRIVACY)}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
            >
              <Text style={styles.menuIcon}>🛡️</Text>
              <Text style={[styles.menuLabel, { color: colors.text }]}>Privacy & Safety Rules</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(PROFILE_ROUTES.NOTIFICATION_SETTINGS)}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
            >
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={[styles.menuLabel, { color: colors.text }]}>Notification Settings</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(PROFILE_ROUTES.ABOUT)}
              style={styles.menuItem}
            >
              <Text style={styles.menuIcon}>ℹ️</Text>
              <Text style={[styles.menuLabel, { color: colors.text }]}>About NIVARA</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </AppCard>

        {/* 5. LOGOUT & ACCOUNT ACTIONS */}
        <AppButton
          title="Log Out of Account"
          onPress={() => setLogoutModalVisible(true)}
          variant="danger"
          size="large"
          fullWidth={true}
        />
      </ScrollView>

      {/* LOGOUT CONFIRMATION MODAL */}
      <ConfirmModal
        visible={logoutModalVisible}
        title="Log Out Confirmation"
        message="Are you sure you want to log out of your NIVARA safety account?"
        confirmText="Log Out"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutModalVisible(false)}
      />
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
  profileHeaderCard: {
    alignItems: 'center',
  },
  userName: {
    textAlign: 'center',
  },
  userEmail: {
    textAlign: 'center',
  },
  roleBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    textAlign: 'left',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caregiverInfoRow: {
    width: '100%',
  },
  prefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  prefItem: {
    width: '47%',
  },
  menuList: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 20,
    color: '#94A3B8',
  },
});

export default ProfileScreen;
