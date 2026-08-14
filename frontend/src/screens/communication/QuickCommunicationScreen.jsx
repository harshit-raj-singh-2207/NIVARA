import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import QuickNeedButton from '../../components/communication/QuickNeedButton';
import textToSpeech from '../../services/audio/textToSpeech';
import useCommunicationStore from '../../store/communicationStore';

export const QuickCommunicationScreen = ({ navigation }) => {
  const { quickNeeds } = useCommunicationStore();

  const handleSpeakNeed = (item) => {
    textToSpeech.speak(item.label);
  };

  return (
    <SafeAreaWrapper>
      <AppHeader title="Quick Needs" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2">One-Tap Communication</Text>
        <Text className="text-xs text-slate-500 mb-4">Tap any phrase below to instantly speak and notify your caregiver.</Text>

        <View className="flex-row flex-wrap -mx-1.5">
          {quickNeeds.map(item => (
            <QuickNeedButton key={item.id} item={item} onPress={handleSpeakNeed} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default QuickCommunicationScreen;
