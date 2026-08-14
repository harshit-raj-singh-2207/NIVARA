import React, { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';

export const PrivacyScreen = ({ navigation }) => {
  const [shareLocation, setShareLocation] = useState(true);
  const [shareTelemetry, setShareTelemetry] = useState(true);
  const [allowAnalytics, setAllowAnalytics] = useState(false);

  return (
    <SafeAreaWrapper className="bg-[#F5F9FF] dark:bg-slate-900">
      <AppHeader title="Privacy & Security" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Simple Language Privacy Commitment */}
        <AppCard className="bg-[#5B8DEF]/10 border-[#5B8DEF]/30 mb-6 p-5">
          <View className="flex-row items-center space-x-3 mb-2">
            <Ionicons name="shield-checkmark" size={24} color="#5B8DEF" />
            <Text className="text-base font-black text-[#1F2937] dark:text-white ml-2">
              Our Privacy Commitment
            </Text>
          </View>
          <Text className="text-xs font-semibold text-[#64748B] dark:text-slate-300 leading-relaxed">
            Your personal data and live location are protected by end-to-end encryption. Sensitive details are ONLY shared with your explicitly verified caregiver.
          </Text>
        </AppCard>

        {/* Detailed Info Cards */}
        <Text className="text-sm font-black text-[#1F2937] dark:text-white mb-2.5 uppercase tracking-wider">
          How Your Data Is Used
        </Text>

        <AppCard className="mb-4">
          <View className="flex-row items-center space-x-3 mb-1.5">
            <Ionicons name="location-outline" size={20} color="#5B8DEF" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-white ml-2">Location Data</Text>
          </View>
          <Text className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
            GPS tracking is used strictly for safe zone geofencing and SOS emergency alerts. Your coordinates are never sold or shared with third parties.
          </Text>
        </AppCard>

        <AppCard className="mb-4">
          <View className="flex-row items-center space-x-3 mb-1.5">
            <Ionicons name="heart-outline" size={20} color="#6FCF97" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-white ml-2">Caregiver & Sensory Data</Text>
          </View>
          <Text className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
            Decibel levels and routine status updates are visible only to your verified guardian (Priya Sharma) to offer prompt assistance during overload.
          </Text>
        </AppCard>

        <AppCard className="mb-6">
          <View className="flex-row items-center space-x-3 mb-1.5">
            <Ionicons name="notifications-outline" size={20} color="#F6D365" />
            <Text className="text-sm font-bold text-[#1F2937] dark:text-white ml-2">Personal Information</Text>
          </View>
          <Text className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
            Name, email, and preferences are stored securely. You can modify or purge your data at any time.
          </Text>
        </AppCard>

        {/* Privacy Controls */}
        <Text className="text-sm font-black text-[#1F2937] dark:text-white mb-2.5 uppercase tracking-wider">
          Privacy Controls
        </Text>

        <AppCard className="flex-row items-center justify-between mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-sm font-bold text-[#1F2937] dark:text-white">Share Live Location with Guardian</Text>
            <Text className="text-xs text-[#64748B] mt-0.5">Required for automatic safe zone detection</Text>
          </View>
          <Switch
            value={shareLocation}
            onValueChange={setShareLocation}
            trackColor={{ false: '#CBD5E1', true: '#5B8DEF' }}
          />
        </AppCard>

        <AppCard className="flex-row items-center justify-between mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-sm font-bold text-[#1F2937] dark:text-white">Share Sensory & Routine Progress</Text>
            <Text className="text-xs text-[#64748B] mt-0.5">Allows caregiver to view daily task completions</Text>
          </View>
          <Switch
            value={shareTelemetry}
            onValueChange={setShareTelemetry}
            trackColor={{ false: '#CBD5E1', true: '#5B8DEF' }}
          />
        </AppCard>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default PrivacyScreen;
