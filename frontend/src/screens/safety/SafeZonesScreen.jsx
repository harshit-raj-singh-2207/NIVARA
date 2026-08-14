import React from 'react';
import { View, FlatList } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import SafeZoneCard from '../../components/safety/SafeZoneCard';
import useSafetyStore from '../../store/safetyStore';

export const SafeZonesScreen = ({ navigation }) => {
  const { safeZones } = useSafetyStore();

  return (
    <SafeAreaWrapper>
      <AppHeader
        title="Safe Zone Geofences"
        showBack
        onBackPress={() => navigation.goBack()}
        rightAction={<AppButton title="+ Add Zone" size="sm" onPress={() => navigation.navigate('AddSafeZone')} />}
      />
      <FlatList
        data={safeZones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <SafeZoneCard zone={item} />}
      />
    </SafeAreaWrapper>
  );
};

export default SafeZonesScreen;
