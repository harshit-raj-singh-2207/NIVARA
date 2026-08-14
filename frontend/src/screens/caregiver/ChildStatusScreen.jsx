import React from 'react';
import { View, Text } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';

export const ChildStatusScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Child Health & Mood Telemetry" showBack onBackPress={() => navigation.goBack()} />
      <View className="p-6">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Real-time Biosignals & Mood Monitoring</Text>
      </View>
    </SafeAreaWrapper>
  );
};

export default ChildStatusScreen;
