import React from 'react';
import { View, Text } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';

export const CaregiverPreferencesScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Caregiver Preferences" showBack onBackPress={() => navigation.goBack()} />
      <View className="p-6">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Alert Sensitivity Settings</Text>
      </View>
    </SafeAreaWrapper>
  );
};

export default CaregiverPreferencesScreen;
