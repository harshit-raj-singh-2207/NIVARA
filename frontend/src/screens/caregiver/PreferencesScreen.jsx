import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import PreferenceCard from '../../components/caregiver/PreferenceCard';
import AppCard from '../../components/common/AppCard';
import { useCaregiver } from '../../hooks/useCaregiver';
import { lightTheme } from '../../theme';
import { Text } from 'react-native';

/**
 * Caregiver Preferences Screen.
 * Allows the caregiver to configure exactly when and how they receive push alerts.
 */
const PreferencesScreen = () => {
  const { preferences, isLoading, loadPreferences, updatePreference } = useCaregiver();

  useEffect(() => {
    loadPreferences();
  }, []);

  const handleToggle = useCallback(async (key, currentValue) => {
    // Attempt update natively in the hook (handles optimistic UI)
    await updatePreference(key, !currentValue);
  }, [updatePreference]);

  return (
    <SafeAreaWrapper style={styles.container}>
      <AppHeader title="Alert Preferences" showBack />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Routing Rules</Text>
        <Text style={styles.sectionDesc}>
          Select which events generate immediate push notifications on your phone.
        </Text>

        <PreferenceCard
          title="Push Notifications"
          description="Master switch for all Nivara backend push notifications."
          icon="notifications-outline"
          value={preferences?.pushEnabled ?? true}
          onToggle={() => handleToggle('pushEnabled', preferences?.pushEnabled ?? true)}
          disabled={isLoading}
        />

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Event Specifics</Text>

        <PreferenceCard
          title="Geofence Alerts"
          description="Get notified immediately when they enter or leave a Safe Zone."
          icon="location-outline"
          value={preferences?.geofenceAlerts ?? true}
          onToggle={() => handleToggle('geofenceAlerts', preferences?.geofenceAlerts ?? true)}
          disabled={isLoading || !(preferences?.pushEnabled)}
        />

        <PreferenceCard
          title="Band Disconnections"
          description="Alert when the GPS band loses connection to their phone."
          icon="watch-outline"
          value={preferences?.bandDisconnects ?? true}
          onToggle={() => handleToggle('bandDisconnects', preferences?.bandDisconnects ?? true)}
          disabled={isLoading || !(preferences?.pushEnabled)}
        />

        <PreferenceCard
          title="Critical Battery Alerts"
          description="Notify when the GPS band drops below 15% battery."
          icon="battery-dead-outline"
          value={preferences?.batteryAlerts ?? true}
          onToggle={() => handleToggle('batteryAlerts', preferences?.batteryAlerts ?? true)}
          disabled={isLoading || !(preferences?.pushEnabled)}
        />

        <AppCard style={styles.infoCard}>
          <Text style={styles.infoText}>
            Note: "SOS / Panic Button" alerts cannot be disabled. They will always bypass these preferences and trigger maximum-volume alerts.
          </Text>
        </AppCard>

      </ScrollView>
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
  sectionTitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
    marginBottom: 4,
  },
  sectionDesc: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.secondary,
    marginBottom: lightTheme.spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: lightTheme.colors.border,
    marginVertical: lightTheme.spacing.lg,
  },
  infoCard: {
    backgroundColor: lightTheme.colors.surfaceHover,
    marginTop: lightTheme.spacing.md,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
  },
  infoText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    fontStyle: 'italic',
  }
});

export default PreferencesScreen;
