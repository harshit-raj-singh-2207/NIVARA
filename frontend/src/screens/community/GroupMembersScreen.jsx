import React from 'react';
import { View } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import MemberList from '../../components/community/MemberList';

const MOCK_MEMBERS = [
  { id: 'm1', name: 'Priya Sharma', role: 'Caregiver / Admin', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { id: 'm2', name: 'Dr. Rahul Mehta', role: 'Specialist', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
];

export const GroupMembersScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <AppHeader title="Group Members" showBack onBackPress={() => navigation.goBack()} />
      <MemberList members={MOCK_MEMBERS} />
    </SafeAreaWrapper>
  );
};

export default GroupMembersScreen;
