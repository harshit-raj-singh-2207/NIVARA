import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import SensoryPreference from '../../components/sensory/SensoryPreference';
import useSensoryStore from '../../store/sensoryStore';

export const SensoryPreferencesScreen = ({ navigation }) => {
  const { preferences, updatePreferences } = useSensoryStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Sensory Thresholds" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SensoryPreference
          title="Enable High Noise Warnings"
          subtitle="Notify when environment noise exceeds 70 dB"
          value={preferences.enableSensoryVibration}
          onValueChange={(val) => updatePreferences({ enableSensoryVibration: val })}
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SensoryPreferencesScreen;
