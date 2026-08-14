import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppCard from '../../components/common/AppCard';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import useAuthStore from '../../store/authStore';
import useUserStore from '../../store/userStore';
import useNotificationStore from '../../store/notificationStore';
import useSafetyStore from '../../store/safetyStore';

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const { profile } = useUserStore();
  const { notifications, getUnreadCount } = useNotificationStore();
  const { triggerSOS, activeSOS, resolveSOS, isTriggering } = useSafetyStore ? useSafetyStore() : { activeSOS: false };

  const [showSosModal, setShowSosModal] = useState(false);

  const unreadCount = getUnreadCount ? getUnreadCount() : notifications.filter(n => !n.read).length;
  const guardian = profile?.caregiverConnection || {
    guardianName: 'Priya Sharma',
    status: 'VERIFIED',
    lastActive: '3 mins ago',
    guardianPhone: '+91 98765 00000',
  };

  const handleSOSPress = async () => {
    if (triggerSOS) {
      await triggerSOS({
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'School Safe Zone, Delhi',
      });
    }
    setShowSosModal(true);
  };

  const handleContactGuardian = () => {
    Alert.alert(
      `Contact Guardian ${guardian.guardianName}`,
      `Would you like to call ${guardian.guardianName} directly?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Linking.openURL(`tel:${guardian.guardianPhone || '+919876500000'}`) },
      ]
    );
  };

  return (
    <SafeAreaWrapper className="bg-[#F5F9FF] dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center space-x-3.5">
            <Avatar source={user?.avatar || profile?.avatar} name={user?.name || profile?.name} size="md" isOnline />
            <View className="ml-3">
              <Text className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Good Day 👋
              </Text>
              <Text className="text-xl font-black text-[#1F2937] dark:text-white">
                {user?.name || profile?.name || 'Aarav Sharma'}
              </Text>
            </View>
          </View>

          {/* Notification Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Notifications, ${unreadCount} unread`}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700/80 shadow-sm relative"
          >
            <Ionicons name="notifications-outline" size={24} color="#5B8DEF" />
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-[#E57373] min-w-[20px] h-[20px] rounded-full px-1 items-center justify-center border-2 border-white dark:border-slate-900">
                <Text className="text-[10px] font-black text-white">{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 1. CURRENT STATUS BANNER */}
        <AppCard className="bg-white dark:bg-slate-800 border-[#6FCF97]/40 mb-6 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <View className="w-10 h-10 rounded-2xl bg-[#6FCF97]/20 items-center justify-center">
                <Text className="text-lg">🟢</Text>
              </View>
              <View className="ml-3">
                <Text className="text-xs font-bold text-[#64748B] uppercase">Current Connection</Text>
                <Text className="text-base font-black text-[#1F2937] dark:text-white">
                  Safe & Connected
                </Text>
              </View>
            </View>
            <View className="px-3 py-1.5 rounded-full bg-[#6FCF97]/20 border border-[#6FCF97]/40">
              <Text className="text-xs font-extrabold text-[#4DB97A]">Active Protection</Text>
            </View>
          </View>
        </AppCard>

        {/* 2. QUICK ACTIONS */}
        <Text className="text-base font-black text-[#1F2937] dark:text-white mb-3">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          <TouchableOpacity
            onPress={handleSOSPress}
            disabled={isTriggering}
            className="w-[48%] bg-[#E57373] p-4 rounded-3xl mb-3 shadow-md border border-[#D35252] flex-row items-center"
          >
            <View className="w-10 h-10 rounded-2xl bg-white/20 items-center justify-center mr-3">
              <Text className="text-xl">🆘</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-black text-white">Need Help</Text>
              <Text className="text-[11px] font-semibold text-rose-100">Tap for SOS</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContactGuardian}
            className="w-[48%] bg-white dark:bg-slate-800 p-4 rounded-3xl mb-3 border border-slate-200 dark:border-slate-700 shadow-sm flex-row items-center"
          >
            <View className="w-10 h-10 rounded-2xl bg-[#5B8DEF]/15 items-center justify-center mr-3">
              <Ionicons name="call" size={20} color="#5B8DEF" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-black text-[#1F2937] dark:text-white">Guardian</Text>
              <Text className="text-[11px] font-semibold text-[#64748B]">Call Priya</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('LearningTab')}
            className="w-[48%] bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex-row items-center"
          >
            <View className="w-10 h-10 rounded-2xl bg-[#F6D365]/25 items-center justify-center mr-3">
              <Ionicons name="calendar" size={20} color="#E5BD45" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-black text-[#1F2937] dark:text-white">My Routine</Text>
              <Text className="text-[11px] font-semibold text-[#64748B]">Visual Schedule</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            className="w-[48%] bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex-row items-center"
          >
            <View className="w-10 h-10 rounded-2xl bg-[#6FCF97]/20 items-center justify-center mr-3">
              <Ionicons name="notifications" size={20} color="#4DB97A" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-black text-[#1F2937] dark:text-white">Alerts</Text>
              <Text className="text-[11px] font-semibold text-[#64748B]">{unreadCount} New</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 3. PERSONALIZED SUPPORT */}
        <Text className="text-base font-black text-[#1F2937] dark:text-white mb-1">
          Personalized Support
        </Text>
        <Text className="text-xs font-semibold text-[#64748B] mb-3">
          How can we help you today?
        </Text>

        <View className="space-y-3 mb-6">
          <AppCard
            onPress={() => navigation.navigate('CommunicationTab')}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center space-x-3.5">
              <View className="w-12 h-12 rounded-2xl bg-[#5B8DEF]/15 items-center justify-center">
                <Text className="text-2xl">🗣️</Text>
              </View>
              <View className="ml-3">
                <Text className="text-base font-black text-[#1F2937] dark:text-white">Communicate</Text>
                <Text className="text-xs font-semibold text-[#64748B]">Speak with voice & AAC card grid</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </AppCard>

          <AppCard
            onPress={() => navigation.navigate('LearningTab')}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center space-x-3.5">
              <View className="w-12 h-12 rounded-2xl bg-[#F6D365]/25 items-center justify-center">
                <Text className="text-2xl">📅</Text>
              </View>
              <View className="ml-3">
                <Text className="text-base font-black text-[#1F2937] dark:text-white">Routine</Text>
                <Text className="text-xs font-semibold text-[#64748B]">Interactive visual task schedules</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </AppCard>

          <AppCard
            onPress={handleSOSPress}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center space-x-3.5">
              <View className="w-12 h-12 rounded-2xl bg-[#E57373]/15 items-center justify-center">
                <Text className="text-2xl">🆘</Text>
              </View>
              <View className="ml-3">
                <Text className="text-base font-black text-[#1F2937] dark:text-white">Get Help</Text>
                <Text className="text-xs font-semibold text-[#64748B]">Instant guardian SOS notification</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </AppCard>
        </View>

        {/* 4. RECENT ACTIVITY */}
        <Text className="text-base font-black text-[#1F2937] dark:text-white mb-3">
          Recent Activity
        </Text>
        <AppCard className="mb-6 p-4">
          <View className="space-y-4">
            <View className="flex-row items-start space-x-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF7D" style={{ marginTop: 2 }} />
              <View className="flex-1 ml-2">
                <Text className="text-sm font-bold text-[#1F2937] dark:text-white">Completed Morning Routine</Text>
                <Text className="text-xs text-[#64748B]">Brush teeth & Breakfast • 2 hours ago</Text>
              </View>
            </View>

            <View className="flex-row items-start space-x-3 pt-1">
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#5B8DEF" style={{ marginTop: 2 }} />
              <View className="flex-1 ml-2">
                <Text className="text-sm font-bold text-[#1F2937] dark:text-white">Used AAC Card "I need water"</Text>
                <Text className="text-xs text-[#64748B]">Text-to-speech spoken • 4 hours ago</Text>
              </View>
            </View>
          </View>
        </AppCard>

        {/* 5. CAREGIVER CONNECTION */}
        <Text className="text-base font-black text-[#1F2937] dark:text-white mb-3">
          Caregiver Connection
        </Text>
        <AppCard className="mb-6 p-4 flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3.5">
            <Avatar name={guardian.guardianName} size="md" isOnline />
            <View className="ml-3">
              <Text className="text-base font-black text-[#1F2937] dark:text-white">
                {guardian.guardianName}
              </Text>
              <View className="flex-row items-center space-x-2 mt-0.5">
                <Text className="text-xs font-bold text-[#4DB97A]">
                  Verified Guardian
                </Text>
                <Text className="text-xs text-[#64748B]">
                  • Active {guardian.lastActive}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleContactGuardian}
            className="p-2.5 rounded-2xl bg-[#5B8DEF]/15 border border-[#5B8DEF]/30"
          >
            <Ionicons name="call-outline" size={20} color="#5B8DEF" />
          </TouchableOpacity>
        </AppCard>
      </ScrollView>

      {/* SOS Alert Modal */}
      <Modal isVisible={showSosModal} onClose={() => setShowSosModal(false)} title="🚨 SOS Help Alert">
        <View className="items-center py-2 text-center">
          <View className="w-16 h-16 rounded-full bg-[#E57373]/20 items-center justify-center mb-3">
            <Ionicons name="alert-circle" size={38} color="#E57373" />
          </View>
          <Text className="text-lg font-black text-[#1F2937] dark:text-white text-center mb-1">
            Guardian & SOS Alert Dispatched
          </Text>
          <Text className="text-xs font-semibold text-[#64748B] text-center mb-5 leading-relaxed">
            Your live safety status has been sent to Guardian <Text className="font-bold text-[#1F2937] dark:text-white">{guardian.guardianName}</Text>.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowSosModal(false);
              navigation.navigate('SafetyTab');
            }}
            className="w-full bg-[#E57373] py-3.5 rounded-2xl items-center mb-2.5 shadow-sm"
          >
            <Text className="text-white font-bold text-sm">Open Live Safety Radar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (resolveSOS) resolveSOS();
              setShowSosModal(false);
            }}
            className="w-full bg-slate-100 dark:bg-slate-800 py-3 rounded-2xl items-center"
          >
            <Text className="text-[#64748B] dark:text-slate-300 font-bold text-xs">Cancel / I Am Safe Now</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
