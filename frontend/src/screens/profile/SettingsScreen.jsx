import React from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import useUserStore from '../../store/userStore';
import useAuthStore from '../../store/authStore';

export const SettingsScreen = ({ navigation }) => {
  const { profile, updatePreferences } = useUserStore();
  const { logout } = useAuthStore();
  const prefs = profile.preferences;

  return (
    <SafeAreaWrapper className="bg-[#F5F9FF] dark:bg-slate-900">
      <AppHeader title="Application Settings" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* APPEARANCE */}
        <Text className="text-sm font-black text-[#1F2937] dark:text-white mb-2.5 uppercase tracking-wider">
          Appearance & Theme
        </Text>
        <AppCard className="flex-row items-center justify-between mb-5">
          <View className="flex-1 mr-3">
            <Text className="text-base font-bold text-[#1F2937] dark:text-white">Dark Mode</Text>
            <Text className="text-xs text-[#64748B] mt-0.5">Reduce visual glare for light-sensitive eyes</Text>
          </View>
          <Switch
            value={prefs.darkMode}
            onValueChange={(val) => updatePreferences({ darkMode: val })}
            trackColor={{ false: '#CBD5E1', true: '#5B8DEF' }}
            thumbColor={prefs.darkMode ? '#FFFFFF' : '#F8FAFC'}
          />
        </AppCard>

        {/* ACCESSIBILITY */}
        <Text className="text-sm font-black text-[#1F2937] dark:text-white mb-2.5 uppercase tracking-wider">
          Accessibility Options
        </Text>
        <AppCard className="flex-row items-center justify-between mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-base font-bold text-[#1F2937] dark:text-white">High Contrast Mode</Text>
            <Text className="text-xs text-[#64748B] mt-0.5">Enhanced borders and strong visual contrast</Text>
          </View>
          <Switch
            value={prefs.highContrast}
            onValueChange={(val) => updatePreferences({ highContrast: val })}
            trackColor={{ false: '#CBD5E1', true: '#5B8DEF' }}
            thumbColor={prefs.highContrast ? '#FFFFFF' : '#F8FAFC'}
          />
        </AppCard>

        <AppCard className="flex-row items-center justify-between mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-base font-bold text-[#1F2937] dark:text-white">AAC Sound & Haptics</Text>
            <Text className="text-xs text-[#64748B] mt-0.5">Audio feedback when tapping communication cards</Text>
          </View>
          <Switch
            value={prefs.soundEffects}
            onValueChange={(val) => updatePreferences({ soundEffects: val })}
            trackColor={{ false: '#CBD5E1', true: '#5B8DEF' }}
            thumbColor={prefs.soundEffects ? '#FFFFFF' : '#F8FAFC'}
          />
        </AppCard>

        <AppCard className="flex-row items-center justify-between mb-5">
          <View className="flex-1 mr-3">
            <Text className="text-base font-bold text-[#1F2937] dark:text-white">Auto-Read AAC Phrases</Text>
            <Text className="text-xs text-[#64748B] mt-0.5">Instantly speak selected AAC cards via TTS</Text>
          </View>
          <Switch
            value={prefs.autoReadAAC}
            onValueChange={(val) => updatePreferences({ autoReadAAC: val })}
            trackColor={{ false: '#CBD5E1', true: '#5B8DEF' }}
            thumbColor={prefs.autoReadAAC ? '#FFFFFF' : '#F8FAFC'}
          />
        </AppCard>

        {/* QUICK NAVIGATION SECTIONS */}
        <Text className="text-sm font-black text-[#1F2937] dark:text-white mb-2.5 uppercase tracking-wider">
          More Settings
        </Text>

        <AppCard onPress={() => navigation.navigate('NotificationSettings')} className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="notifications-outline" size={20} color="#64748B" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">Notifications Preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </AppCard>

        <AppCard onPress={() => navigation.navigate('Privacy')} className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">Privacy & Location Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </AppCard>

        <AppCard onPress={() => navigation.navigate('About')} className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="information-circle-outline" size={20} color="#64748B" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">About & Platform Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </AppCard>

        <AppButton title="Sign Out" variant="danger" onPress={logout} size="lg" />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SettingsScreen;
