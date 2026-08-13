/**
 * RegisterScreen.jsx
 * Complete, production-grade Registration Screen for NIVARA AI-Powered Safety & Communication app.
 * Supports role selection (User vs Caregiver), input validation, loading states, and error handling.
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme';
import { AUTH_ROUTES } from '../../constants/routes';
import useAuthStore from '../../store/authStore';
import authApi from '../../services/api/authApi';
import {
  validateEmail,
  validateFullName,
  validatePassword,
} from '../../utils/validation';
import { handleApiError } from '../../utils/errorHandler';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import Loading from '../../components/common/Loading';

export const RegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const { register, isLoading, error: authError, clearError } = useAuthStore();

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' | 'caregiver'
  const [caregiverCode, setCaregiverCode] = useState('');

  // Validation Errors State
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const nameErr = validateFullName(fullName);
    if (nameErr) newErrors.fullName = nameErr;

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validatePassword(password);
    if (passErr) newErrors.password = passErr;

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async () => {
    clearError();
    if (!validateForm()) return;

    try {
      // Execute registration via authStore which saves JWT and sets isAuthenticated=true
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role,
        caregiver_code: role === 'user' && caregiverCode ? caregiverCode.trim() : undefined,
      });
    } catch (err) {
      handleApiError(err, 'Registration Failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="Create Account"
        subtitle="Join NIVARA Safety Network"
        showBack={true}
        onBackPress={() => {
          clearError();
          navigation.goBack();
        }}
      />

      {isLoading && <Loading overlay={true} size="large" message="Creating your account..." />}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppCard variant="elevated" style={[shadows.small, { marginBottom: spacing.lg }]}>
          {authError ? (
            <View style={[styles.errorBanner, { backgroundColor: colors.status.errorBackground }]}>
              <Text style={{ color: colors.status.error, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
                ⚠️ {authError}
              </Text>
            </View>
          ) : null}

          {/* Account Role Selector Toggle */}
          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.bold,
              marginBottom: spacing.xs,
            }}
          >
            Select Account Role:
          </Text>

          <View style={[styles.roleSelectorRow, { marginBottom: spacing.md }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRole('user')}
              style={[
                styles.roleChip,
                {
                  backgroundColor: role === 'user' ? colors.primary : colors.surfaceSubtle,
                  borderColor: role === 'user' ? colors.primary : colors.border,
                  borderRadius: borderRadius.md,
                  paddingVertical: spacing.xs + 4,
                },
              ]}
            >
              <Text style={{ fontSize: 18, marginBottom: 2 }}>👤</Text>
              <Text
                style={{
                  color: role === 'user' ? '#FFFFFF' : colors.text,
                  fontSize: typography.sizes.xs,
                  fontWeight: role === 'user' ? typography.weights.bold : typography.weights.medium,
                }}
              >
                I am a User
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRole('caregiver')}
              style={[
                styles.roleChip,
                {
                  backgroundColor: role === 'caregiver' ? colors.primary : colors.surfaceSubtle,
                  borderColor: role === 'caregiver' ? colors.primary : colors.border,
                  borderRadius: borderRadius.md,
                  paddingVertical: spacing.xs + 4,
                },
              ]}
            >
              <Text style={{ fontSize: 18, marginBottom: 2 }}>🩺</Text>
              <Text
                style={{
                  color: role === 'caregiver' ? '#FFFFFF' : colors.text,
                  fontSize: typography.sizes.xs,
                  fontWeight: role === 'caregiver' ? typography.weights.bold : typography.weights.medium,
                }}
              >
                I am a Caregiver
              </Text>
            </TouchableOpacity>
          </View>

          {/* Full Name Input */}
          <AppInput
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
              if (authError) clearError();
            }}
            error={errors.fullName}
          />

          {/* Email Address Input */}
          <AppInput
            label="Email Address"
            placeholder="user@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              if (authError) clearError();
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password Input */}
          <AppInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              if (authError) clearError();
            }}
            error={errors.password}
            secureTextEntry={true}
          />

          {/* Confirm Password Input */}
          <AppInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              if (authError) clearError();
            }}
            error={errors.confirmPassword}
            secureTextEntry={true}
          />

          {/* Caregiver Pairing Code Input for User role */}
          {role === 'user' && (
            <AppInput
              label="Caregiver Pairing Code (Optional)"
              placeholder="e.g. CG-881920"
              value={caregiverCode}
              onChangeText={setCaregiverCode}
              hint="Directly link with your caregiver's account"
            />
          )}

          {/* Submit Button */}
          <AppButton
            title="Create Account"
            onPress={handleRegisterSubmit}
            loading={isLoading}
            variant="primary"
            size="large"
            fullWidth={true}
            style={{ marginTop: spacing.xs }}
          />

          {/* Back to Login */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              clearError();
              navigation.navigate(AUTH_ROUTES.LOGIN);
            }}
            style={styles.loginSwitchRow}
          >
            <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm }}>
              Already have an account?{' '}
              <Text style={{ color: colors.primary, fontWeight: typography.weights.bold }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </AppCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorBanner: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  roleSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  loginSwitchRow: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default RegisterScreen;
