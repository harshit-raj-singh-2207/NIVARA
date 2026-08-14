import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import Avatar from '../../components/common/Avatar';

export const CaregiverProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Caregiver Profile" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
        <Avatar name="Sunita Patel" size="xl" className="mb-3" />
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Sunita Patel</Text>
        <Text className="text-xs text-indigo-600 font-semibold mt-0.5">Parent & Special Educator</Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default CaregiverProfileScreen;
