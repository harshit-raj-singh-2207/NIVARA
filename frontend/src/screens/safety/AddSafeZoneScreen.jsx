import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import useSafetyStore from '../../store/safetyStore';

export const AddSafeZoneScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('200');
  const { addSafeZone } = useSafetyStore();

  const handleSave = () => {
    if (name) {
      addSafeZone({ name, address, radiusMeters: parseInt(radius, 10) || 200, latitude: 28.6139, longitude: 77.2090 });
      navigation.goBack();
    }
  };

  return (
    <SafeAreaWrapper>
      <AppHeader title="Create Safe Zone" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <AppInput label="Safe Zone Name" placeholder="e.g. Grandma's House" value={name} onChangeText={setName} icon="shield-outline" />
        <AppInput label="Address / Center Location" placeholder="B-14 Park Street" value={address} onChangeText={setAddress} icon="location-outline" />
        <AppInput label="Radius (Meters)" placeholder="200" value={radius} onChangeText={setRadius} keyboardType="numeric" icon="resize-outline" />
        <AppButton title="Save Safe Zone" onPress={handleSave} size="lg" className="mt-4" />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default AddSafeZoneScreen;
