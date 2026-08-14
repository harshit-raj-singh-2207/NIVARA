import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import SOSButton from '../../components/safety/SOSButton';
import EmergencyCard from '../../components/safety/EmergencyCard';
import LocationCard from '../../components/safety/LocationCard';
import BandStatus from '../../components/safety/BandStatus';
import SafeZoneCard from '../../components/safety/SafeZoneCard';
import useSafetyStore from '../../store/safetyStore';

export const SafetyHomeScreen = ({ navigation }) => {
  const { triggerSOS, cancelSOS, isEmergencyActive, currentLocation, gpsBand, safeZones } = useSafetyStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Safety & Tracking" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {isEmergencyActive ? (
          <EmergencyCard status="ACTIVE" time="Just now" />
        ) : null}

        <SOSButton
          isEmergencyActive={isEmergencyActive}
          onPress={() => {
            if (isEmergencyActive) {
              cancelSOS();
            } else {
              triggerSOS();
            }
          }}
        />

        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">Live Location & Device</Text>
        <View className="mb-3">
          <LocationCard location={currentLocation} />
        </View>

        <View className="mb-6">
          <BandStatus band={gpsBand} />
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold text-slate-900 dark:text-white">Active Safe Zones</Text>
          <Text onPress={() => navigation.navigate('SafeZones')} className="text-xs font-bold text-indigo-600">Manage</Text>
        </View>
        {safeZones.map(zone => (
          <SafeZoneCard key={zone.id} zone={zone} onPress={() => navigation.navigate('LiveLocation')} />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SafetyHomeScreen;
