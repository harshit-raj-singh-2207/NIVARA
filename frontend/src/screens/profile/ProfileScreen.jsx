import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import Avatar from '../../components/common/Avatar';
import AppButton from '../../components/common/AppButton';
import useAuthStore from '../../store/authStore';
import useUserStore from '../../store/userStore';

export const ProfileScreen = ({ navigation }) => {
  const { user, logout, switchRole } = useAuthStore();
  const { profile } = useUserStore();

  const isCaregiver = user?.role === 'CAREGIVER';

  return (
    <SafeAreaWrapper className="bg-[#F5F9FF] dark:bg-slate-900">
      <AppHeader title="Account & Profile" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Profile Card */}
        <AppCard className="items-center p-6 mb-6">
          <Avatar
            source={user?.avatar || profile?.avatar}
            name={user?.name || profile?.name || 'Aarav'}
            size="xl"
            className="mb-3"
          />
          <Text className="text-2xl font-black text-[#1F2937] dark:text-white">
            {user?.name || profile?.name || 'Aarav Sharma'}
          </Text>
          <Text className="text-xs font-semibold text-[#64748B] mb-3">
            {user?.email || profile?.email || 'aarav@example.com'}
          </Text>

          {/* Role Badge */}
          <View className={`px-4 py-1.5 rounded-full border ${
            isCaregiver ? 'bg-[#6FCF97]/20 border-[#6FCF97]' : 'bg-[#5B8DEF]/15 border-[#5B8DEF]'
          }`}>
            <Text className={`text-xs font-black ${isCaregiver ? 'text-[#4DB97A]' : 'text-[#5B8DEF]'}`}>
              {isCaregiver ? 'CAREGIVER PORTAL MODE' : 'SELF / USER MODE'}
            </Text>
          </View>
        </AppCard>

        {/* Role Switching Option */}
        <AppCard
          onPress={() => switchRole(isCaregiver ? 'INDIVIDUAL' : 'CAREGIVER')}
          className="flex-row items-center justify-between mb-6"
        >
          <View className="flex-row items-center space-x-3.5">
            <View className="w-10 h-10 rounded-2xl bg-[#5B8DEF]/15 items-center justify-center">
              <Ionicons name="swap-horizontal" size={22} color="#5B8DEF" />
            </View>
            <View className="ml-3">
              <Text className="text-sm font-black text-[#1F2937] dark:text-white">
                Switch Role View
              </Text>
              <Text className="text-xs font-semibold text-[#64748B] mt-0.5">
                Current: {isCaregiver ? 'Caregiver Dashboard' : 'Individual User Tools'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </AppCard>

        {/* Menu Navigation Options */}
        <Text className="text-base font-black text-[#1F2937] dark:text-white mb-3">
          Account Settings
        </Text>

        <AppCard onPress={() => navigation.navigate('EditProfile')} className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="person-outline" size={22} color="#64748B" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">Edit Profile Information</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </AppCard>

        <AppCard onPress={() => navigation.navigate('Settings')} className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="settings-outline" size={22} color="#64748B" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">Accessibility & Display</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </AppCard>

        <AppCard onPress={() => navigation.navigate('NotificationSettings')} className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="notifications-outline" size={22} color="#64748B" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">Notification Preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </AppCard>

        <AppCard onPress={() => navigation.navigate('Privacy')} className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="lock-closed-outline" size={22} color="#64748B" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">Privacy & Permissions</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </AppCard>

        <AppCard onPress={() => navigation.navigate('About')} className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="information-circle-outline" size={22} color="#64748B" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">About CareMate AI</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </AppCard>

        <AppButton
          title="Sign Out"
          variant="danger"
          onPress={logout}
          size="lg"
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ProfileScreen;
