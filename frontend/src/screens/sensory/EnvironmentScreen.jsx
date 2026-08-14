import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';

export const EnvironmentScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Sensory Telemetry" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Environmental Audio & Light History</Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default EnvironmentScreen;
