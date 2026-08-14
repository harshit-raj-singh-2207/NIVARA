import React from 'react';
import { View, Text } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';

export const GroupDetailsScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Group Details" showBack onBackPress={() => navigation.goBack()} />
      <View className="p-6">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Group Information & Rules</Text>
      </View>
    </SafeAreaWrapper>
  );
};

export default GroupDetailsScreen;
