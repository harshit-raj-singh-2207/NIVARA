import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import CaregiverHeader from '../../components/caregiver/CaregiverHeader';
import ChildStatusCard from '../../components/caregiver/ChildStatusCard';
import CurrentLocationCard from '../../components/caregiver/CurrentLocationCard';
import RoutineStatus from '../../components/caregiver/RoutineStatus';
import DeviceStatus from '../../components/caregiver/DeviceStatus';
import EmergencyStatus from '../../components/caregiver/EmergencyStatus';
import useCaregiverStore from '../../store/caregiverStore';

export const CaregiverDashboard = ({ navigation }) => {
  const { children, recentAlerts } = useCaregiverStore();
  const currentChild = children[0];

  return (
    <SafeAreaWrapper>
      <CaregiverHeader caregiverName="Priya Sharma" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <EmergencyStatus isEmergency={false} />

        <Text className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">Monitored Profile</Text>
        <ChildStatusCard child={currentChild} />

        <Text className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">Location & Boundary Status</Text>
        <CurrentLocationCard locationName="Home Safe Zone" address={currentChild?.lastLocation} />

        <Text className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">Routine & Device Telemetry</Text>
        <RoutineStatus progress="75% (3/4 Tasks Done)" />
        <DeviceStatus deviceName="NIVARA Smart Band V2" battery={currentChild?.batteryLevel} status="CONNECTED" />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default CaregiverDashboard;
