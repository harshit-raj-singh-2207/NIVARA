import React from 'react';
import { View, Text } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';

export const DiscoverGroupsScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Discover Groups" showBack onBackPress={() => navigation.goBack()} />
      <View className="p-6">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Explore Trending Groups</Text>
      </View>
    </SafeAreaWrapper>
  );
};

export default DiscoverGroupsScreen;
