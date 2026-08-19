import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import useAuthStore from '../../store/authStore';
import { isValidPassword, isValidVerificationCode } from '../../utils/validation';

export const ResetPasswordScreen = ({ navigation, route }) => {
  const email = route?.params?.email || '';
  const [code, setCode] = useState('123456');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const { resetPassword, isLoading } = useAuthStore();

  const handleReset = async () => {
    const errs = {};
    if (!isValidVerificationCode(code)) {
      errs.code = 'Enter a valid 6-digit numeric reset code.';
    }
    if (!isValidPassword(newPassword)) {
      errs.newPassword = 'Password must be at least 6 characters.';
    }
    if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    const res = await resetPassword(email, code, newPassword);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
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
            Reset Password
          </Text>
          <Text className="text-sm font-semibold text-[#64748B] dark:text-slate-400 mt-1.5 leading-relaxed">
            Enter the 6-digit code sent to your email along with your new password.
          </Text>
        </View>

        {success ? (
          <View className="mb-6 p-4 rounded-2xl bg-[#4CAF7D]/15 border border-[#4CAF7D] flex-row items-center space-x-3">
            <Ionicons name="checkmark-circle" size={22} color="#4CAF7D" />
            <Text className="flex-1 text-xs font-bold text-[#4CAF7D]">
              Password reset successfully! Redirecting to Sign In...
            </Text>
          </View>
        ) : null}

        <AppInput
          label="6-Digit Reset Code"
          placeholder="e.g. 123456"
          value={code}
          onChangeText={(val) => {
            setCode(val);
            if (errors.code) setErrors({ ...errors, code: null });
          }}
          keyboardType="number-pad"
          icon="key-outline"
          error={errors.code}
        />

        <AppInput
          label="New Password"
          placeholder="At least 6 characters"
          value={newPassword}
          onChangeText={(val) => {
            setNewPassword(val);
            if (errors.newPassword) setErrors({ ...errors, newPassword: null });
          }}
          secureTextEntry
          icon="lock-closed-outline"
          error={errors.newPassword}
        />

        <AppInput
          label="Confirm New Password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChangeText={(val) => {
            setConfirmPassword(val);
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
          }}
          secureTextEntry
          icon="checkmark-circle-outline"
          error={errors.confirmPassword}
        />

        <AppButton
          title="Update Password"
          onPress={handleReset}
          isLoading={isLoading}
          isDisabled={isLoading}
          size="lg"
          className="mt-2 mb-4"
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ResetPasswordScreen;
