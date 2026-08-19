import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CommunityHomeScreen from '../screens/community/CommunityHomeScreen';
import ChatListScreen from '../screens/community/ChatListScreen';
import DirectMessageScreen from '../screens/community/DirectMessageScreen';
import NewChatScreen from '../screens/community/NewChatScreen';
import GroupsScreen from '../screens/community/GroupsScreen';
import DiscoverGroupsScreen from '../screens/community/DiscoverGroupsScreen';
import CreateGroupScreen from '../screens/community/CreateGroupScreen';
import GroupChatScreen from '../screens/community/GroupChatScreen';
import GroupDetailsScreen from '../screens/community/GroupDetailsScreen';
import GroupMembersScreen from '../screens/community/GroupMembersScreen';
import CommunityFeedScreen from '../screens/community/CommunityFeedScreen';
import CreatePostScreen from '../screens/community/CreatePostScreen';
import PostDetailsScreen from '../screens/community/PostDetailsScreen';
import CaregiverProfileScreen from '../screens/community/CaregiverProfileScreen';
import VerificationRequestScreen from '../screens/community/VerificationRequestScreen';
import ProgramRunnerScreen from '../screens/community/ProgramRunnerScreen';

import PhoneSupportScreen from '../screens/caregiver/PhoneSupportScreen';
import SupportCenterScreen from '../screens/caregiver/SupportCenterScreen';
import ActiveGroupsScreen from '../screens/community/ActiveGroupsScreen';
import SafetyPrivacyCenterScreen from '../screens/caregiver/SafetyPrivacyCenterScreen';

const Stack = createNativeStackNavigator();

export default function CommunityNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="CommunityHome">
      <Stack.Screen name="CommunityHome" component={CommunityHomeScreen} />
      <Stack.Screen name="ProgramRunner" component={ProgramRunnerScreen} />
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="DirectMessage" component={DirectMessageScreen} />
      <Stack.Screen name="NewChat" component={NewChatScreen} />
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="ActiveGroups" component={ActiveGroupsScreen} />
      <Stack.Screen name="DiscoverGroups" component={DiscoverGroupsScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="GroupChat" component={GroupChatScreen} />
      <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
      <Stack.Screen name="GroupMembers" component={GroupMembersScreen} />
      <Stack.Screen name="CommunityFeed" component={CommunityFeedScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
      <Stack.Screen name="CaregiverProfile" component={CaregiverProfileScreen} />
      <Stack.Screen name="VerificationRequest" component={VerificationRequestScreen} />
      <Stack.Screen name="SupportCenter" component={SupportCenterScreen} />
      <Stack.Screen name="PhoneSupport" component={SupportCenterScreen} />
      <Stack.Screen name="SafetyPrivacyCenter" component={SafetyPrivacyCenterScreen} />
    </Stack.Navigator>
  );
}

