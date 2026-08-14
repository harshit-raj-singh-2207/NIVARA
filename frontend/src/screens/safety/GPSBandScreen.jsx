import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import BandStatus from '../../components/safety/BandStatus';
import useSafetyStore from '../../store/safetyStore';

export const GPSBandScreen = ({ navigation }) => {
  const { gpsBand } = useSafetyStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="GPS Band Telemetry" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <BandStatus band={gpsBand} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default GPSBandScreen;
