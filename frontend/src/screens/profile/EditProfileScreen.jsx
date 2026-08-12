/**
 * EditProfileScreen.jsx
 * Complete, production-grade Edit Profile Screen for NIVARA.
 * Handles full name, emergency contacts, sensory noise/brightness thresholds, and communication style preferences.
 */

import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme';
import useUserStore from '../../store/userStore';
import userApi from '../../services/api/userApi';
import { validateFullName, validatePhoneNumber } from '../../utils/validation';
import { handleApiError, showSuccessAlert } from '../../utils/errorHandler';
import { goBack as navGoBack } from '../../navigation/navigationRef';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import Avatar from '../../components/common/Avatar';
import Loading from '../../components/common/Loading';

export const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const { user, updateProfile } = useUserStore();

  // Extract initial values from user store
  const initialPrimaryPhone =
    user?.emergency_contacts?.[0]?.phone || user?.phone_number || '';
  const initialSecondaryPhone = user?.emergency_contacts?.[1]?.phone || '';
  const initialNoiseDb = user?.sensory_preferences?.noise_threshold_db || 85;
  const initialBrightnessToggle =
    (user?.sensory_preferences?.brightness_sensitivity_level || 3) >= 3;
  const initialCommStyle =
    user?.communication_preferences?.text_simplification_level || 'simple';

  // Form State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [primaryPhone, setPrimaryPhone] = useState(initialPrimaryPhone);
  const [secondaryPhone, setSecondaryPhone] = useState(initialSecondaryPhone);
  const [noiseThresholdDb, setNoiseThresholdDb] = useState(initialNoiseDb);
  const [brightnessSensitivity, setBrightnessSensitivity] = useState(
    initialBrightnessToggle
  );
  const [communicationStyle, setCommunicationStyle] = useState(initialCommStyle);

  // Form & Loading State
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleCancel = () => {
    if (navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    } else {
      navGoBack();
    }
  };

  const handleAvatarPresetSelect = () => {
    const avatarPresets = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    ];
    const nextAvatar =
      avatarPresets[(avatarPresets.indexOf(avatarUrl) + 1) % avatarPresets.length];
    setAvatarUrl(nextAvatar);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Full Name
    const nameErr = validateFullName(fullName);
    if (nameErr) newErrors.fullName = nameErr;

    // Validate Primary Emergency Contact Phone
    if (primaryPhone && primaryPhone.trim()) {
      const pPhoneErr = validatePhoneNumber(primaryPhone);
      if (pPhoneErr) newErrors.primaryPhone = pPhoneErr;
    }

    // Validate Secondary Emergency Contact Phone
    if (secondaryPhone && secondaryPhone.trim()) {
      const sPhoneErr = validatePhoneNumber(secondaryPhone);
      if (sPhoneErr) newErrors.secondaryPhone = sPhoneErr;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const emergencyContacts = [];
      if (primaryPhone.trim()) {
        emergencyContacts.push({
          name: 'Primary Emergency Contact',
          phone: primaryPhone.trim(),
          relationship: 'Primary Caregiver',
          is_primary: true,
        });
      }
      if (secondaryPhone.trim()) {
        emergencyContacts.push({
          name: 'Secondary Emergency Contact',
          phone: secondaryPhone.trim(),
          relationship: 'Secondary Caregiver',
          is_primary: false,
        });
      }

      const updatePayload = {
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || null,
        phone_number: primaryPhone.trim() || null,
        emergency_contacts: emergencyContacts,
        sensory_preferences: {
          ...user?.sensory_preferences,
          noise_threshold_db: noiseThresholdDb,
          brightness_sensitivity_level: brightnessSensitivity ? 4 : 2,
        },
        communication_preferences: {
          ...user?.communication_preferences,
          text_simplification_level: communicationStyle,
        },
      };

      // Execute update via userApi or userStore
      await userApi.updateProfile(updatePayload);
      if (updateProfile) {
        await updateProfile(updatePayload);
      }

      setSubmitting(false);

      showSuccessAlert(
        'Profile Updated',
        'Your user profile, emergency contacts, and sensory settings have been updated.',
        () => handleCancel()
      );
    } catch (err) {
      setSubmitting(false);
      handleApiError(err, 'Profile Update Failed');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Edit Profile"
        subtitle="Update Profile & Sensory Preferences"
        showBack={true}
        onBackPress={handleCancel}
      />

      {submitting && <Loading overlay={true} size="large" message="Saving profile changes..." />}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. PROFILE PICTURE / AVATAR PICKER SECTION */}
        <AppCard variant="elevated" style={[styles.avatarCard, shadows.small, { marginBottom: spacing.lg }]}>
          <Avatar name={fullName || 'User'} source={avatarUrl} size="xlarge" status="online" />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleAvatarPresetSelect}
            style={[
              styles.avatarChangeBtn,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.primary,
                borderRadius: borderRadius.md,
                marginTop: spacing.sm,
                paddingVertical: spacing.xs + 2,
                paddingHorizontal: spacing.md,
              },
            ]}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.bold,
              }}
            >
              📷 Change Profile Picture
            </Text>
          </TouchableOpacity>

          <AppInput
            label="Avatar Image URL (Optional)"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            style={{ marginTop: spacing.md }}
          />
        </AppCard>

        {/* 2. PERSONAL INFORMATION & EMERGENCY CONTACTS */}
        <AppCard variant="bordered" style={{ marginBottom: spacing.lg }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.bold,
                marginBottom: spacing.md,
              },
            ]}
          >
            👤 Personal Details & Emergency Phone Numbers
          </Text>

          <AppInput
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
            }}
            error={errors.fullName}
          />

          <AppInput
            label="Primary Emergency Contact Number"
            placeholder="+1 (555) 123-4567"
            value={primaryPhone}
            onChangeText={(text) => {
              setPrimaryPhone(text);
              if (errors.primaryPhone) setErrors((prev) => ({ ...prev, primaryPhone: null }));
            }}
            error={errors.primaryPhone}
            keyboardType="phone-pad"
            hint="Primary number for SOS emergency dispatch"
          />

          <AppInput
            label="Secondary Emergency Contact Number (Optional)"
            placeholder="+1 (555) 987-6543"
            value={secondaryPhone}
            onChangeText={(text) => {
              setSecondaryPhone(text);
              if (errors.secondaryPhone) setErrors((prev) => ({ ...prev, secondaryPhone: null }));
            }}
            error={errors.secondaryPhone}
            keyboardType="phone-pad"
          />
        </AppCard>

        {/* 3. SENSORY PREFERENCE CONTROLS */}
        <AppCard variant="sensoryHighlight" style={{ marginBottom: spacing.lg }}>
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
            🔊 Sensory Alert & Noise Threshold Settings
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.xs,
              marginBottom: spacing.md,
            }}
          >
            Configure environmental noise alert thresholds and display sensitivity rules.
          </Text>

          {/* Ambient Noise Alert Level Selector */}
          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.semibold,
              marginBottom: spacing.xs,
            }}
          >
            Ambient Noise Alert Level: {noiseThresholdDb} dB
          </Text>

          <View style={[styles.dbSelectorRow, { marginBottom: spacing.md }]}>
            {[75, 80, 85, 90, 95].map((dbVal) => (
              <TouchableOpacity
                key={dbVal}
                onPress={() => setNoiseThresholdDb(dbVal)}
                style={[
                  styles.dbChip,
                  {
                    backgroundColor:
                      noiseThresholdDb === dbVal ? colors.primary : colors.surfaceSubtle,
                    borderColor: noiseThresholdDb === dbVal ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.xs + 2,
                    paddingHorizontal: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={{
                    color: noiseThresholdDb === dbVal ? '#FFFFFF' : colors.text,
                    fontSize: typography.sizes.xs,
                    fontWeight:
                      noiseThresholdDb === dbVal
                        ? typography.weights.bold
                        : typography.weights.medium,
                  }}
                >
                  {dbVal} dB
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Screen Brightness Sensitivity Toggle */}
          <View
            style={[
              styles.toggleRow,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                padding: spacing.sm,
              },
            ]}
          >
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.bold,
                }}
              >
                Screen Brightness Warning Alerts
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
                Warn when rapid glare or brightness spikes occur
              </Text>
            </View>
            <Switch
              value={brightnessSensitivity}
              onValueChange={setBrightnessSensitivity}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={brightnessSensitivity ? colors.primary : colors.surfaceSubtle}
            />
          </View>
        </AppCard>

        {/* 4. COMMUNICATION STYLE SELECTOR */}
        <AppCard variant="elevated" style={{ marginBottom: spacing.xl }}>
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
            💬 Communication Output Style
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.xs,
              marginBottom: spacing.md,
            }}
          >
            Select how AAC text and automatic responses are formatted for speech synthesis.
          </Text>

          <View style={styles.commStyleRow}>
            {[
              { id: 'simple', label: 'Simple', desc: 'Direct & easy phrases' },
              { id: 'friendly', label: 'Friendly', desc: 'Warm & casual speech' },
              { id: 'formal', label: 'Formal', desc: 'Polite & structured' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => setCommunicationStyle(item.id)}
                style={[
                  styles.commCard,
                  {
                    backgroundColor:
                      communicationStyle === item.id ? colors.surfaceSubtle : colors.cardBackground,
                    borderColor:
                      communicationStyle === item.id ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                    marginBottom: spacing.xs,
                  },
                ]}
              >
                <View style={styles.commCardHeader}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: typography.sizes.sm,
                      fontWeight: typography.weights.bold,
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text style={{ fontSize: 16 }}>
                    {communicationStyle === item.id ? '🔘' : '⚪'}
                  </Text>
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
                  {item.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </AppCard>

        {/* 5. ACTION BUTTONS (SAVE & CANCEL) */}
        <View style={styles.actionsContainer}>
          <AppButton
            title="Save Changes"
            onPress={handleSaveChanges}
            loading={submitting}
            variant="primary"
            size="large"
            fullWidth={true}
            style={{ marginBottom: spacing.sm }}
          />

          <AppButton
            title="Cancel"
            onPress={handleCancel}
            variant="secondary"
            size="large"
            fullWidth={true}
          />
        </View>
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
  avatarCard: {
    alignItems: 'center',
  },
  avatarChangeBtn: {
    borderWidth: 1,
  },
  sectionTitle: {
    textAlign: 'left',
  },
  dbSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dbChip: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  commStyleRow: {
    width: '100%',
  },
  commCard: {
    borderWidth: 1.5,
  },
  commCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsContainer: {
    width: '100%',
  },
});

export default EditProfileScreen;
