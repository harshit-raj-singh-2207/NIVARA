/**
 * Reset Password Screen for NIVARA.
 * Completes password reset using token and new password.
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { AUTH_ROUTES } from '../../constants/routes';
import apiClient from '../../services/api/apiClient';
import { ENDPOINTS } from '../../constants/api';
import { validatePassword } from '../../utils/validation';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';

export const ResetPasswordScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const initialToken = route?.params?.token || '';
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!token.trim()) {
      setError('Reset token is required');
      return;
    }
    const passErr = validatePassword(newPassword);
    if (passErr) {
      setError(passErr);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.post(ENDPOINTS.RESET_PASSWORD, {
        token: token.trim(),
        new_password: newPassword,
      });
      setSuccessMessage(response.message || 'Password reset successfully!');
      setTimeout(() => {
        navigation.navigate(AUTH_ROUTES.LOGIN);
      }, 1500);
    } catch (e) {
      setError(e?.error?.message || e?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Reset Password" showBack={true} onBackPress={() => navigation.goBack()} />
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
            Enter New Password
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
            label="Reset Token"
            placeholder="Paste reset token"
            value={token}
            onChangeText={setToken}
          />

          <AppInput
            label="New Password"
            placeholder="••••••••"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              if (error) setError(null);
            }}
            error={error}
            secureTextEntry={true}
          />

          <AppButton
            title="Complete Password Reset"
            onPress={handleResetPassword}
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

export default ResetPasswordScreen;
