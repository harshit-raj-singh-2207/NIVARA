import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import useAuthStore from '../../store/authStore';
import { validateLoginForm } from '../../utils/validation';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('aarav@example.com');
  const [password, setPassword] = useState('password123');
  const [formErrors, setFormErrors] = useState({});

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    const { isValid, errors } = validateLoginForm({ email, password });
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    await login(email, password);
  };

  return (
    <SafeAreaWrapper className="bg-[#F5F9FF] dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContainer: 'center' }}>
        {/* App Title & Subtitle */}
        <View className="mb-8 mt-4">
          <View className="w-14 h-14 rounded-2xl bg-[#5B8DEF] items-center justify-center mb-4 shadow-sm">
            <Ionicons name="heart-half" size={32} color="#FFFFFF" />
          </View>
          <Text className="text-3xl font-black text-[#1F2937] dark:text-white">
            Welcome to CareMate AI
          </Text>
          <Text className="text-sm font-semibold text-[#64748B] dark:text-slate-400 mt-1">
            Sign in to access your personalized support workspace
          </Text>
        </View>

        {/* Top level server/auth error display */}
        {error && (
          <View className="mb-5 p-4 rounded-2xl bg-[#E57373]/15 border border-[#E57373] flex-row items-center space-x-3">
            <Ionicons name="alert-circle" size={22} color="#E57373" />
            <Text className="flex-1 text-xs font-bold text-[#E57373]">
              {error}
            </Text>
          </View>
        )}

        {/* Form Inputs */}
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
          placeholder="••••••••"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (formErrors.password) setFormErrors({ ...formErrors, password: null });
          }}
          secureTextEntry
          icon="lock-closed-outline"
          error={formErrors.password}
        />

        {/* Forgot Password Link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          accessible={true}
          accessibilityRole="button"
          className="self-end mb-6 py-1"
        >
          <Text className="text-xs font-bold text-[#5B8DEF] dark:text-blue-400">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Sign In Action Button */}
        <AppButton
          title="Sign In"
          onPress={handleLogin}
          isLoading={isLoading}
          isDisabled={isLoading}
          size="lg"
          className="mb-4"
        />

        {/* Demo Quick Logins for Hackathon Testing */}
        <View className="mt-2 mb-6 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Text className="text-xs font-bold text-[#64748B] dark:text-slate-400 mb-2.5 uppercase tracking-wider">
            ⚡ Quick Demo Accounts:
          </Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => {
                setEmail('aarav@example.com');
                setPassword('password123');
                login('aarav@example.com', 'password123');
              }}
              className="flex-1 bg-[#5B8DEF]/15 py-2.5 rounded-xl items-center border border-[#5B8DEF]/30"
            >
              <Text className="text-xs font-bold text-[#5B8DEF]">User Mode</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setEmail('priya.caregiver@example.com');
                setPassword('password123');
                login('priya.caregiver@example.com', 'password123');
              }}
              className="flex-1 bg-[#6FCF97]/20 py-2.5 rounded-xl items-center border border-[#6FCF97]/40"
            >
              <Text className="text-xs font-bold text-[#4DB97A]">Caregiver Mode</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Link to Register */}
        <View className="flex-row justify-center items-center mt-auto py-4">
          <Text className="text-sm font-semibold text-[#64748B]">
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            accessible={true}
            accessibilityRole="button"
            className="ml-1.5 p-1"
          >
            <Text className="text-sm font-bold text-[#5B8DEF]">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;
