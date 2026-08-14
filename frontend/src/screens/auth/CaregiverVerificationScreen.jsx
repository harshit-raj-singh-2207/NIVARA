import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import useAuthStore from '../../store/authStore';
import { isValidVerificationCode } from '../../utils/validation';

export const CaregiverVerificationScreen = ({ navigation, route }) => {
  const [contactInfo, setContactInfo] = useState(route?.params?.email || 'priya.caregiver@example.com');
  const [code, setCode] = useState('123456'); // Default demo verification code
  const [verificationStatus, setVerificationStatus] = useState('Pending'); // 'Pending', 'Verified', 'Failed', 'Expired'
  const [resendSent, setResendSent] = useState(false);
  const [codeError, setCodeError] = useState('');

  const { verifyCaregiver, isLoading, error } = useAuthStore();

  const handleVerify = async () => {
    if (!isValidVerificationCode(code)) {
      setCodeError('Enter a valid 6-digit numeric verification code.');
      setVerificationStatus('Failed');
      return;
    }
    setCodeError('');
    setVerificationStatus('Pending');

    const result = await verifyCaregiver(code, contactInfo);
    if (result.success) {
      setVerificationStatus('Verified');
    } else {
      setVerificationStatus('Failed');
      setCodeError(result.error || 'Verification failed. Code expired or invalid.');
    }
  };

  const handleResend = () => {
    setResendSent(true);
    setVerificationStatus('Pending');
    setCodeError('');
    setTimeout(() => setResendSent(false), 5000);
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'Verified':
        return { text: '🟢 VERIFIED', color: 'bg-[#4CAF7D]/20 text-[#4CAF7D] border-[#4CAF7D]' };
      case 'Failed':
        return { text: '🔴 VERIFICATION FAILED', color: 'bg-[#E57373]/20 text-[#E57373] border-[#E57373]' };
      case 'Expired':
        return { text: '⚠️ CODE EXPIRED', color: 'bg-[#EABF4A]/20 text-[#EABF4A] border-[#EABF4A]' };
      case 'Pending':
      default:
        return { text: '⏳ VERIFICATION PENDING', color: 'bg-[#5B8DEF]/20 text-[#5B8DEF] border-[#5B8DEF]' };
    }
  };

  const badge = getStatusBadge();

  return (
    <SafeAreaWrapper className="bg-[#F5F9FF] dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="self-start p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6"
        >
          <Ionicons name="chevron-back" size={20} color="#5B8DEF" />
        </TouchableOpacity>

        <View className="mb-6">
          <Text className="text-3xl font-black text-[#1F2937] dark:text-white">
            Caregiver Verification
          </Text>
          <Text className="text-sm font-semibold text-[#64748B] dark:text-slate-400 mt-1.5 leading-relaxed">
            Ensure that guardian connection is established securely before sharing sensitive location or sensory telemetry.
          </Text>
        </View>

        {/* Status Card */}
        <AppCard className="mb-6 border">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Connection Status
            </Text>
            <View className={`px-3 py-1 rounded-full border ${badge.color}`}>
              <Text className="text-[11px] font-black">{badge.text}</Text>
            </View>
          </View>
          <Text className="text-base font-bold text-[#1F2937] dark:text-white mt-1">
            Caregiver Contact: {contactInfo}
          </Text>
          <Text className="text-xs font-medium text-[#64748B] mt-1">
            Demo code for testing: <Text className="font-bold text-[#5B8DEF]">123456</Text>
          </Text>
        </AppCard>

        {/* Inputs */}
        <AppInput
          label="Caregiver Email or Phone"
          placeholder="priya.caregiver@example.com"
          value={contactInfo}
          onChangeText={setContactInfo}
          icon="mail-outline"
        />

        <AppInput
          label="6-Digit Verification Code"
          placeholder="e.g. 123456"
          value={code}
          onChangeText={(val) => {
            setCode(val);
            if (codeError) setCodeError('');
          }}
          keyboardType="number-pad"
          icon="shield-checkmark-outline"
          error={codeError}
        />

        {/* Resend Code Action */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-xs font-semibold text-[#64748B]">
            {resendSent ? '✅ Verification code resent!' : "Didn't receive the code?"}
          </Text>
          <TouchableOpacity onPress={handleResend} disabled={resendSent}>
            <Text className={`text-xs font-bold ${resendSent ? 'text-slate-400' : 'text-[#5B8DEF]'}`}>
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <AppButton
          title={verificationStatus === 'Verified' ? 'Verification Complete — Proceed' : 'Verify Caregiver Code'}
          onPress={verificationStatus === 'Verified' ? () => navigation.replace('Login') : handleVerify}
          isLoading={isLoading}
          isDisabled={isLoading}
          variant={verificationStatus === 'Verified' ? 'secondary' : 'primary'}
          size="lg"
          className="mb-4"
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default CaregiverVerificationScreen;
