import React from 'react';
import { View, FlatList } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import GroupCard from '../../components/community/GroupCard';
import useCommunityStore from '../../store/communityStore';

export const GroupsScreen = ({ navigation }) => {
  const { groups } = useCommunityStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Support Groups" showBack onBackPress={() => navigation.goBack()} />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <GroupCard group={item} onJoin={() => {}} />}
      />
    </SafeAreaWrapper>
  );
};

export default GroupsScreen;
