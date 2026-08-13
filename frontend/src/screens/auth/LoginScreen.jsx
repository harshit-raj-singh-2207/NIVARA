/**
 * LoginScreen.jsx
 * Complete, production-grade Login Screen for NIVARA AI-Powered Safety & Communication app.
 * Handles user/caregiver authentication with input validation, loading overlays, and error toasts.
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
import { validateEmail, validatePassword } from '../../utils/validation';
import { handleApiError } from '../../utils/errorHandler';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import Loading from '../../components/common/Loading';

export const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography, shadows } = theme;

  const { login, isLoading, error: authError, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleLoginSubmit = async () => {
    clearError();
    if (!validateForm()) return;

    try {
      // Execute login via authStore which updates JWT tokens and sets isAuthenticated=true
      await login(email.trim(), password);
    } catch (err) {
      handleApiError(err, 'Login Failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader title="Sign In" subtitle="Welcome back to NIVARA Safety" />

      {isLoading && <Loading overlay={true} size="large" message="Signing into your account..." />}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header & Tagline */}
        <View style={styles.brandContainer}>
          <Text style={[styles.brandLogo, { color: colors.primary }]}>🌌 NIVARA</Text>
          <Text style={[styles.brandSubtitle, { color: colors.textSecondary, fontSize: typography.sizes.sm }]}>
            AI-Powered Sensory Adaptation & Emergency Safety Platform
          </Text>
        </View>

        {/* Login Form Card */}
        <AppCard variant="elevated" style={[shadows.small, { marginBottom: spacing.lg }]}>
          {authError ? (
            <View style={[styles.errorBanner, { backgroundColor: colors.status.errorBackground }]}>
              <Text style={{ color: colors.status.error, fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
                ⚠️ {authError}
              </Text>
            </View>
          ) : null}

          {/* Email Address Input */}
          <AppInput
            label="Email Address"
            placeholder="e.g. user@nivara.app"
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

          {/* Forgot Password Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              clearError();
              navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD);
            }}
            style={styles.forgotBtn}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: typography.sizes.xs,
                fontWeight: typography.weights.bold,
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Submit Button */}
          <AppButton
            title="Sign In to Account"
            onPress={handleLoginSubmit}
            loading={isLoading}
            variant="primary"
            size="large"
            fullWidth={true}
            style={{ marginTop: spacing.xs }}
          />

          {/* Switch to Registration */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              clearError();
              navigation.navigate(AUTH_ROUTES.REGISTER);
            }}
            style={styles.registerSwitchRow}
          >
            <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm }}>
              Don't have an account yet?{' '}
              <Text style={{ color: colors.primary, fontWeight: typography.weights.bold }}>
                Register Account
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandLogo: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
  },
  brandSubtitle: {
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
  },
  errorBanner: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginTop: -4,
  },
  registerSwitchRow: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default LoginScreen;
