import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChildStatusCard from '../../components/caregiver/ChildStatusCard';
import DeviceStatusCard from '../../components/caregiver/DeviceStatusCard';
import CaregiverAlertCard from '../../components/caregiver/CaregiverAlertCard';

const ChildStatusScreen = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ChildStatusCard childName="Alex (Sample)" status="safe" lastUpdate="Vitals stable" />
        
        <CaregiverAlertCard 
          title="Routine Reminder" 
          message="Alex has an upcoming sensory break scheduled in 15 minutes." 
          severity="warning" 
        />
        
        <DeviceStatusCard battery={82} isConnected={true} deviceType="Nivara Bluetooth Band" />
        <DeviceStatusCard deviceType="Primary Mobile" battery={45} isConnected={true} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 }
});
export default ChildStatusScreen;
