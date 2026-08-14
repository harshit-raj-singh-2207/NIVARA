import React from 'react';
import { View, Text } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import GroupHeader from '../../components/community/GroupHeader';

export const GroupChatScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <GroupHeader title="Parent Support Circle" membersCount={1420} onBackPress={() => navigation.goBack()} />
      <View className="flex-1 p-4 justify-center items-center">
        <Text className="text-slate-500">Group Chat Messages</Text>
      </View>
    </SafeAreaWrapper>
  );
};

export default GroupChatScreen;
