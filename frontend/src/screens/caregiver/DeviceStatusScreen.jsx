import React from 'react';
import { View, Text } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';

export const DeviceStatusScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Device Diagnostics" showBack onBackPress={() => navigation.goBack()} />
      <View className="p-6">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Smart Band Diagnostics & Battery</Text>
      </View>
    </SafeAreaWrapper>
  );
};

export default DeviceStatusScreen;
