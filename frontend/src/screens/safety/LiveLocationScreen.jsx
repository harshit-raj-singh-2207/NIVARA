import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import MapView from '../../components/safety/MapView';
import LocationCard from '../../components/safety/LocationCard';
import useSafetyStore from '../../store/safetyStore';

export const LiveLocationScreen = ({ navigation }) => {
  const { currentLocation } = useSafetyStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Live Location Map" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <MapView latitude={currentLocation.latitude} longitude={currentLocation.longitude} label="Aarav's Location" />
        <View className="mt-4">
          <LocationCard location={currentLocation} />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default LiveLocationScreen;
