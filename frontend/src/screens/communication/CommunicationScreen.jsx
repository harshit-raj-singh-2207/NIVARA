import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import CommunicationCard from '../../components/communication/CommunicationCard';

export const CommunicationScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="AAC & Communication" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">Select Communication Mode</Text>

        <CommunicationCard
          title="Visual AAC Grid Board"
          category="Tap cards to compose & speak complete sentences"
          icon="grid-outline"
          onPress={() => navigation.navigate('AAC')}
        />

        <CommunicationCard
          title="Quick Needs & Emergency Phrases"
          category="One-tap phrases for instant caregiver alerts"
          icon="flash-outline"
          onPress={() => navigation.navigate('QuickCommunication')}
        />

        <CommunicationCard
          title="Emotion & Mood Logger"
          category="Express feelings & track sensory trigger logs"
          icon="happy-outline"
          onPress={() => navigation.navigate('Emotion')}
        />

        <CommunicationCard
          title="Speech & Phrase History"
          category="View recently spoken phrases and saved templates"
          icon="time-outline"
          onPress={() => navigation.navigate('CommunicationHistory')}
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default CommunicationScreen;
