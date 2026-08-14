import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import useAuthStore from '../../store/authStore';
import { validateRegisterForm } from '../../utils/validation';

export const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('INDIVIDUAL'); // 'INDIVIDUAL' or 'CAREGIVER'
  const [formErrors, setFormErrors] = useState({});

  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    const { isValid, errors } = validateRegisterForm({ name, email, password, confirmPassword, role });
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const result = await register({ name, email, password, role });
    if (result.success && role === 'CAREGIVER') {
      navigation.navigate('CaregiverVerification', { email });
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
            Create Account
          </Text>
          <Text className="text-sm font-semibold text-[#64748B] dark:text-slate-400 mt-1">
            Join CareMate AI to customize your inclusive experience
          </Text>
        </View>

        {error && (
          <View className="mb-5 p-4 rounded-2xl bg-[#E57373]/15 border border-[#E57373] flex-row items-center space-x-3">
            <Ionicons name="alert-circle" size={22} color="#E57373" />
            <Text className="flex-1 text-xs font-bold text-[#E57373]">{error}</Text>
          </View>
        )}

        {/* Role Selector */}
        <Text className="text-sm font-bold text-[#1F2937] dark:text-slate-200 mb-2">
          Select Account Role
        </Text>
        <View className="flex-row space-x-3 mb-5">
          <TouchableOpacity
            onPress={() => setRole('INDIVIDUAL')}
            className={`flex-1 p-4 rounded-2xl border-2 flex-row items-center space-x-3 ${
              role === 'INDIVIDUAL'
                ? 'bg-[#5B8DEF]/15 border-[#5B8DEF]'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Ionicons
              name="person"
              size={22}
              color={role === 'INDIVIDUAL' ? '#5B8DEF' : '#64748B'}
            />
            <View className="ml-2">
              <Text
                className={`text-sm font-bold ${
                  role === 'INDIVIDUAL' ? 'text-[#5B8DEF]' : 'text-[#1F2937] dark:text-white'
                }`}
              >
                User / Self
              </Text>
              <Text className="text-[11px] font-medium text-[#64748B]">AAC & Routines</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setRole('CAREGIVER')}
            className={`flex-1 p-4 rounded-2xl border-2 flex-row items-center space-x-3 ${
              role === 'CAREGIVER'
                ? 'bg-[#6FCF97]/20 border-[#6FCF97]'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Ionicons
              name="shield-checkmark"
              size={22}
              color={role === 'CAREGIVER' ? '#4DB97A' : '#64748B'}
            />
            <View className="ml-2">
              <Text
                className={`text-sm font-bold ${
                  role === 'CAREGIVER' ? 'text-[#4DB97A]' : 'text-[#1F2937] dark:text-white'
                }`}
              >
                Caregiver
              </Text>
              <Text className="text-[11px] font-medium text-[#64748B]">Guardian Portal</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <AppInput
          label="Full Name"
          placeholder="e.g. Aarav Sharma"
          value={name}
          onChangeText={(val) => {
            setName(val);
            if (formErrors.name) setFormErrors({ ...formErrors, name: null });
          }}
          icon="person-outline"
          error={formErrors.name}
        />

        <AppInput
          label="Email Address"
          placeholder="e.g. aarav@example.com"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            if (formErrors.email) setFormErrors({ ...formErrors, email: null });
          }}
          icon="mail-outline"
          keyboardType="email-address"
          error={formErrors.email}
        />

        <AppInput
          label="Password"
          placeholder="At least 6 characters"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (formErrors.password) setFormErrors({ ...formErrors, password: null });
          }}
          secureTextEntry
          icon="lock-closed-outline"
          error={formErrors.password}
        />

        <AppInput
          label="Confirm Password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChangeText={(val) => {
            setConfirmPassword(val);
            if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: null });
          }}
          secureTextEntry
          icon="checkmark-circle-outline"
          error={formErrors.confirmPassword}
        />

        <AppButton
          title={role === 'CAREGIVER' ? 'Continue to Verification' : 'Create Account'}
          onPress={handleRegister}
          isLoading={isLoading}
          isDisabled={isLoading}
          size="lg"
          className="mt-2 mb-6"
        />

        <View className="flex-row justify-center items-center py-4">
          <Text className="text-sm font-semibold text-[#64748B]">Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} className="ml-1.5 p-1">
            <Text className="text-sm font-bold text-[#5B8DEF]">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default RegisterScreen;
