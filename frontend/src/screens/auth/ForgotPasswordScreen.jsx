/**
 * Forgot Password Screen for NIVARA.
 * Initiates password reset procedure.
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { AUTH_ROUTES } from '../../constants/routes';
import apiClient from '../../services/api/apiClient';
import { ENDPOINTS } from '../../constants/api';
import { validateEmail } from '../../utils/validation';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';

export const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
      setSuccessMessage(response.message || 'Password reset link sent to your email.');
      if (response.reset_token) {
        setTimeout(() => {
          navigation.navigate(AUTH_ROUTES.RESET_PASSWORD, { token: response.reset_token });
        }, 1500);
      }
    } catch (e) {
      setError(e?.error?.message || e?.message || 'Password reset request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Forgot Password" showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}>
        <AppCard variant="elevated">
          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.md,
              fontWeight: typography.weights.bold,
              marginBottom: spacing.xs,
            }}
          >
            Reset Your Password
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.sm,
              marginBottom: spacing.md,
            }}
          >
            Enter your account email address and we'll issue a password reset token.
          </Text>

          {successMessage && (
            <View
              style={[
                styles.messageBox,
                { backgroundColor: colors.status.successBackground, marginBottom: spacing.md },
              ]}
            >
              <Text style={{ color: colors.status.success, fontSize: typography.sizes.sm }}>
                {successMessage}
              </Text>
            </View>
          )}

          <AppInput
            label="Registered Email"
            placeholder="user@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(null);
            }}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppButton
            title="Send Reset Instructions"
            onPress={handleRequestReset}
            loading={loading}
            variant="primary"
            size="medium"
          />
        </AppCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  messageBox: {
    padding: 10,
    borderRadius: 8,
  },
});

export default ForgotPasswordScreen;
