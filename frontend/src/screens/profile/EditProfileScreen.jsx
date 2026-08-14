import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import Avatar from '../../components/common/Avatar';
import useUserStore from '../../store/userStore';

const COMM_OPTIONS = [
  { id: 'Voice', label: 'Voice & Speech', icon: 'mic-outline' },
  { id: 'Text', label: 'Text Input', icon: 'create-outline' },
  { id: 'Icons', label: 'AAC Grid Icons', icon: 'grid-outline' },
  { id: 'Pictures', label: 'Visual Pictures', icon: 'image-outline' },
];

export const EditProfileScreen = ({ navigation }) => {
  const { profile, updateProfile } = useUserStore();

  const [name, setName] = useState(profile?.name || 'Aarav Sharma');
  const [phone, setPhone] = useState(profile?.phone || '+91 98765 43210');
  const [avatar, setAvatar] = useState(profile?.avatar || '');
  const [language, setLanguage] = useState(profile?.preferredLanguage || 'English (US)');
  const [commPref, setCommPref] = useState(profile?.communicationPreference || 'Icons');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((res) => setTimeout(res, 600));
    updateProfile({
      name,
      phone,
      avatar,
      preferredLanguage: language,
      communicationPreference: commPref,
    });
    setIsSaving(false);
    navigation.goBack();
  };

  return (
    <SafeAreaWrapper className="bg-[#F5F9FF] dark:bg-slate-900">
      <AppHeader title="Edit Profile" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Avatar Header */}
        <View className="items-center mb-6">
          <Avatar source={avatar} name={name} size="xl" className="mb-3" />
          <Text className="text-xs font-bold text-[#5B8DEF]">Tap below to update avatar URL</Text>
        </View>

        {/* Basic Information */}
        <Text className="text-base font-black text-[#1F2937] dark:text-white mb-3">
          Personal Information
        </Text>
        <AppInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          icon="person-outline"
        />
        <AppInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          icon="call-outline"
          keyboardType="phone-pad"
        />
        <AppInput
          label="Profile Photo URL"
          placeholder="https://..."
          value={avatar}
          onChangeText={setAvatar}
          icon="image-outline"
        />
        <AppInput
          label="Preferred Language"
          value={language}
          onChangeText={setLanguage}
          icon="language-outline"
        />

        {/* Communication Preference Selection */}
        <Text className="text-base font-black text-[#1F2937] dark:text-white mt-2 mb-3">
          Primary Communication Mode
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {COMM_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setCommPref(opt.id)}
              className={`w-[48%] p-4 rounded-2xl mb-3 border-2 flex-row items-center space-x-3 ${
                commPref === opt.id
                  ? 'bg-[#5B8DEF]/15 border-[#5B8DEF]'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Ionicons
                name={opt.icon}
                size={22}
                color={commPref === opt.id ? '#5B8DEF' : '#64748B'}
              />
              <Text
                className={`text-xs font-bold ml-2 ${
                  commPref === opt.id ? 'text-[#5B8DEF]' : 'text-[#1F2937] dark:text-white'
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <AppButton
          title="Save Profile Changes"
          onPress={handleSave}
          isLoading={isSaving}
          isDisabled={isSaving}
          size="lg"
          className="mt-2 mb-6"
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default EditProfileScreen;
