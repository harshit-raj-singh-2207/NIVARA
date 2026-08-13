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
  );
};

const styles = StyleSheet.create({
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
});

export default SafetyHomeScreen;
