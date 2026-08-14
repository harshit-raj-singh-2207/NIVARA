import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import APP_CONFIG from '../../constants/config';

export const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper className="bg-[#F5F9FF] dark:bg-slate-900">
      <AppHeader title="About CareMate AI" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        {/* App Logo & Header */}
        <View className="w-24 h-24 rounded-3xl bg-[#5B8DEF] items-center justify-center mb-4 shadow-md">
          <Ionicons name="heart-half" size={52} color="#FFFFFF" />
        </View>

        <Text className="text-3xl font-black text-[#1F2937] dark:text-white mb-1">
          CareMate AI
        </Text>
        <Text className="text-xs font-bold text-[#5B8DEF] mb-4">
          Version {APP_CONFIG.version || '1.0.0'} (Hackathon Build)
        </Text>

        {/* Mission Statement */}
        <AppCard className="w-full bg-white dark:bg-slate-800 p-5 mb-6 text-center border-l-4 border-l-[#5B8DEF]">
          <Text className="text-xs font-bold text-[#5B8DEF] uppercase mb-1">Our Mission</Text>
          <Text className="text-base font-black text-[#1F2937] dark:text-white leading-snug">
            "Helping people communicate, stay connected and receive personalized support."
          </Text>
          <Text className="text-xs text-[#64748B] dark:text-slate-400 mt-3 leading-relaxed">
            CareMate AI is an accessibility-first platform specifically tailored for individuals with autism and Down Syndrome, providing voice-assisted AAC tools, real-time sensory regulation, and connected caregiver safety networks.
          </Text>
        </AppCard>

        {/* Info Links */}
        <View className="w-full space-y-3 mb-6">
          <AppCard
            onPress={() => navigation.navigate('Privacy')}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center space-x-3">
              <Ionicons name="shield-checkmark-outline" size={20} color="#5B8DEF" />
              <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </AppCard>

          <AppCard
            onPress={() => Linking.openURL('https://nivara.org/terms')}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center space-x-3">
              <Ionicons name="document-text-outline" size={20} color="#5B8DEF" />
              <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </AppCard>

          <AppCard
            onPress={() => Linking.openURL(`mailto:${APP_CONFIG.supportEmail || 'support@nivara.org'}`)}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center space-x-3">
              <Ionicons name="mail-outline" size={20} color="#5B8DEF" />
              <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 ml-3">Contact Support & Feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </AppCard>
        </View>

        <Text className="text-xs font-semibold text-[#94A3B8] text-center">
          © 2026 CareMate AI • Built for Hackathon Excellence
        </Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default AboutScreen;
