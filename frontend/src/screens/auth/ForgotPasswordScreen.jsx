import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import useAuthStore from '../../store/authStore';
import { isValidEmail } from '../../utils/validation';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('aarav@example.com');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { forgotPassword, isLoading } = useAuthStore();

  const handleSendReset = async () => {
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    const result = await forgotPassword(email);
    if (result.success) {
      setSuccessMessage('Reset code sent! Check your email inbox.');
      setTimeout(() => {
        navigation.navigate('ResetPassword', { email });
      }, 1200);
    }
  };

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
            Forgot Password
          </Text>
          <Text className="text-sm font-semibold text-[#64748B] dark:text-slate-400 mt-1.5 leading-relaxed">
            Enter your registered email address and we will send a 6-digit password reset code to recover access.
          </Text>
        </View>

        {successMessage ? (
          <View className="mb-6 p-4 rounded-2xl bg-[#4CAF7D]/15 border border-[#4CAF7D] flex-row items-center space-x-3">
            <Ionicons name="checkmark-circle" size={22} color="#4CAF7D" />
            <Text className="flex-1 text-xs font-bold text-[#4CAF7D]">
              {successMessage}
            </Text>
          </View>
        ) : null}

        <AppInput
          label="Registered Email"
          placeholder="aarav@example.com"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            if (emailError) setEmailError('');
          }}
          icon="mail-outline"
          keyboardType="email-address"
          error={emailError}
        />

        <AppButton
          title="Send Password Reset Code"
          onPress={handleSendReset}
          isLoading={isLoading}
          isDisabled={isLoading}
          size="lg"
          className="mt-2 mb-4"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPassword', { email })}
          className="items-center py-2"
        >
          <Text className="text-xs font-bold text-[#5B8DEF]">
            Already have a reset code? Enter it here
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ForgotPasswordScreen;
