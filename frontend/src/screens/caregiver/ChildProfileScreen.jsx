import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';

export const ChildProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Child Profile Settings" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Profile Details & Specific Sensory Profile</Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ChildProfileScreen;
