import React from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import useUserStore from '../../store/userStore';

export const NotificationSettingsScreen = ({ navigation }) => {
  const { profile, updatePreferences } = useUserStore();
  const prefs = profile.preferences;

  return (
    <SafeAreaWrapper className="bg-[#F5F9FF] dark:bg-slate-900">
      <AppHeader title="Notification Settings" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-sm font-black text-[#1F2937] dark:text-white mb-2.5 uppercase tracking-wider">
          Alert Channels & Preferences
        </Text>

        <AppCard className="flex-row items-center justify-between mb-3.5">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center space-x-2 mb-1">
              <Ionicons name="alert-circle-outline" size={18} color="#E57373" />
              <Text className="text-sm font-bold text-[#1F2937] dark:text-white ml-2">Emergency Alerts</Text>
            </View>
            <Text className="text-xs text-[#64748B] mt-0.5">Critical SOS alerts and safe zone boundary exits</Text>
          </View>
          <Switch
            value={prefs.emergencyNotifications !== false}
            onValueChange={(val) => updatePreferences({ emergencyNotifications: val })}
            trackColor={{ false: '#CBD5E1', true: '#E57373' }}
          />
        </AppCard>

        <AppCard className="flex-row items-center justify-between mb-3.5">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center space-x-2 mb-1">
              <Ionicons name="person-outline" size={18} color="#4DB97A" />
              <Text className="text-sm font-bold text-[#1F2937] dark:text-white ml-2">Caregiver Activity</Text>
            </View>
            <Text className="text-xs text-[#64748B] mt-0.5">Updates, messages, and routine edits from guardian</Text>
          </View>
          <Switch
            value={prefs.caregiverNotifications !== false}
            onValueChange={(val) => updatePreferences({ caregiverNotifications: val })}
            trackColor={{ false: '#CBD5E1', true: '#6FCF97' }}
          />
        </AppCard>

        <AppCard className="flex-row items-center justify-between mb-3.5">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center space-x-2 mb-1">
              <Ionicons name="calendar-outline" size={18} color="#5B8DEF" />
              <Text className="text-sm font-bold text-[#1F2937] dark:text-white ml-2">Routine Reminders</Text>
            </View>
            <Text className="text-xs text-[#64748B] mt-0.5">Timers for morning, study, and sensory breaks</Text>
          </View>
          <Switch
            value={prefs.routineNotifications !== false}
            onValueChange={(val) => updatePreferences({ routineNotifications: val })}
            trackColor={{ false: '#CBD5E1', true: '#5B8DEF' }}
          />
        </AppCard>

        <AppCard className="flex-row items-center justify-between mb-3.5">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center space-x-2 mb-1">
              <Ionicons name="sparkles-outline" size={18} color="#E5BD45" />
              <Text className="text-sm font-bold text-[#1F2937] dark:text-white ml-2">General & Community</Text>
            </View>
            <Text className="text-xs text-[#64748B] mt-0.5">Community post replies, tips, and platform updates</Text>
          </View>
          <Switch
            value={prefs.generalNotifications === true}
            onValueChange={(val) => updatePreferences({ generalNotifications: val })}
            trackColor={{ false: '#CBD5E1', true: '#F6D365' }}
          />
        </AppCard>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default NotificationSettingsScreen;
