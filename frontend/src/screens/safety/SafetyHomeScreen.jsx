import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import ConnectionStatus from '../../components/safety/ConnectionStatus';
import LocationCard from '../../components/safety/LocationCard';
import SOSButton from '../../components/safety/SOSButton';
import Loading from '../../components/common/Loading';
import EventTimeline from '../../components/safety/EventTimeline';
import { useSafety } from '../../hooks/useSafety';
import { useBluetooth } from '../../hooks/useBluetooth';
import { ROUTES } from '../../constants/routes';
import { lightTheme } from '../../theme';

/**
 * The main landing screen for the Supported Individual.
 * Focuses on high-legibility, a massive SOS button, and band connection status.
 */
const SafetyHomeScreen = ({ navigation }) => {
  const { 
    deviceLocation,
    currentZone,
    activeEmergency,
    recentEvents,
    isLoading,
    loadDashboardData,
    triggerEmergency,
  } = useSafety();

  const { bandStatus } = useBluetooth();

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Use a big SOS trigger wrapper
  const handleSOS = useCallback(async () => {
    const success = await triggerEmergency('APP_SOS');
    if (success) {
      // Immediately navigate to the active emergency screen
      navigation.navigate(ROUTES.SAFETY.EMERGENCY_ACTIVE);
    }
  }, [triggerEmergency, navigation]);

  // Navigate to Bluetooth Manager
  const handleManageBand = useCallback(() => {
    navigation.navigate(ROUTES.SAFETY.GPS_BAND);
  }, [navigation]);

  // If there's an active emergency, we should just show that screen instantly
  useEffect(() => {
    if (activeEmergency) {
      navigation.navigate(ROUTES.SAFETY.EMERGENCY_ACTIVE);
    }
  }, [activeEmergency, navigation]);


  if (isLoading && !deviceLocation) {
    return (
      <SafeAreaWrapper>
        <AppHeader title="Nivara Home" />
        <Loading message="Securing connection..." />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <AppHeader title="Nivara Home" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadDashboardData}
            tintColor={lightTheme.colors.primary}
          />
        }
      >
        
        {/* Core SOS Interaction */}
        <View style={styles.sosContainer}>
          <SOSButton onPress={handleSOS} />
        </View>

        {/* GPS Band Connection */}
        <ConnectionStatus 
          bandStatus={bandStatus} 
          onManagePress={handleManageBand} 
        />

        {/* Current Location & Zone Status */}
        <LocationCard 
          location={deviceLocation} 
          currentZone={currentZone} 
        />

        {/* Activity Timeline */}
        {recentEvents && recentEvents.length > 0 && (
          <View style={styles.timelineSection}>
            <EventTimeline 
              events={recentEvents} 
              isLoading={false} 
            />
          </View>
        )}

        {/* Extra padding at bottom */}
        <View style={{ height: 40 }} />

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
  sosContainer: {
    alignItems: 'center',
    marginVertical: lightTheme.spacing.xl,
  },
  timelineSection: {
    marginTop: lightTheme.spacing.lg,
  },
});

export default SafetyHomeScreen;
