import React from 'react';
import { View, Text } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import SOSButton from '../../components/safety/SOSButton';
import useSafetyStore from '../../store/safetyStore';

export const EmergencyScreen = ({ navigation }) => {
  const { isEmergencyActive, triggerSOS, cancelSOS } = useSafetyStore();

  return (
    <SafeAreaWrapper className="bg-red-600">
      <AppHeader title="Emergency Control" showBack onBackPress={() => navigation.goBack()} />
      <View className="flex-1 items-center justify-center p-6 text-center">
        <Text className="text-white font-black text-3xl mb-2 text-center">Emergency Mode</Text>
        <Text className="text-white/80 text-sm text-center mb-8">SOS Alert has been broadcast to all emergency contacts & caregivers.</Text>
        <SOSButton isEmergencyActive onPress={cancelSOS} />
      </View>
    </SafeAreaWrapper>
  );
};

export default EmergencyScreen;
