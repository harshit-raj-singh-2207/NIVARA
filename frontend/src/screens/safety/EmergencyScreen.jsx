import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import EmergencyCard from '../../components/safety/EmergencyCard';
import ContactCard from '../../components/caregiver/ContactCard';
import AppButton from '../../components/common/AppButton';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { useSafety } from '../../hooks/useSafety';
import { lightTheme } from '../../theme';

/**
 * Emergency Active Screen.
 * Takes over the full screen when an SOS is in progress.
 * Displays the emergency details and a list of contacts to call.
 */
const EmergencyScreen = ({ navigation }) => {
  const { 
    activeEmergency,
    contacts,
    isLoading,
    resolveEmergency,
    cancelActiveEmergency,
  } = useSafety();

  const handleResolve = useCallback(async () => {
    await resolveEmergency();
    // Navigate back after resolving
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [resolveEmergency, navigation]);

  const handleCancelFalseAlarm = useCallback(async () => {
    await cancelActiveEmergency();
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [cancelActiveEmergency, navigation]);

  if (!activeEmergency && !isLoading) {
    return (
      <SafeAreaWrapper>
        <AppHeader title="Emergency" showBack />
        <EmptyState 
          icon="checkmark-circle"
          title="All Clear"
          message="There is no active emergency. You are safe."
          buttonText="Go Back"
          onButtonPress={() => navigation.goBack()}
        />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      {/* Pulsing Red Header Bar */}
      <View style={styles.alertBar}>
        <Ionicons name="alert" size={20} color="#fff" />
        <Text style={styles.alertBarText}>EMERGENCY ACTIVE</Text>
        <Ionicons name="alert" size={20} color="#fff" />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Detail Card */}
        {activeEmergency && (
          <EmergencyCard 
            emergency={activeEmergency} 
            onResolve={handleResolve}
            isLoading={isLoading}
          />
        )}

        {/* Emergency Contacts Section */}
        <Text style={styles.sectionTitle}>Contact Someone</Text>
        <Text style={styles.sectionSubtitle}>
          Tap a contact below to quickly call or message them.
        </Text>

        {contacts && contacts.length > 0 ? (
          contacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))
        ) : (
          <EmptyState 
            icon="people-outline"
            title="No Contacts"
            message="Add emergency contacts from the Safety settings screen."
            compact
          />
        )}

        {/* False Alarm Option */}
        <View style={styles.falseAlarmSection}>
          <Text style={styles.falseAlarmTitle}>False Alarm?</Text>
          <Text style={styles.falseAlarmText}>
            If this was accidental, cancel the alert. Emergency contacts and caregivers will be notified.
          </Text>
          <AppButton 
            title="Cancel — This Was a Mistake" 
            variant="outline"
            onPress={handleCancelFalseAlarm}
            isLoading={isLoading}
            style={styles.cancelButton}
          />
        </View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {isLoading && <Loading fullScreen message="Updating emergency status..." />}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  alertBar: {
    backgroundColor: lightTheme.colors.status.emergency,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: lightTheme.spacing.sm,
    gap: lightTheme.spacing.sm,
  },
  alertBarText: {
    ...lightTheme.typography.h3,
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scrollContent: {
    padding: lightTheme.spacing.md,
  },
  sectionTitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
    marginBottom: 4,
    marginTop: lightTheme.spacing.md,
  },
  sectionSubtitle: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.secondary,
    marginBottom: lightTheme.spacing.lg,
  },
  falseAlarmSection: {
    marginTop: lightTheme.spacing.xl,
    padding: lightTheme.spacing.lg,
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
  },
  falseAlarmTitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.primary,
    marginBottom: lightTheme.spacing.sm,
  },
  falseAlarmText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.text.secondary,
    marginBottom: lightTheme.spacing.lg,
  },
  cancelButton: {
    borderColor: lightTheme.colors.text.secondary,
  },
});

export default EmergencyScreen;
