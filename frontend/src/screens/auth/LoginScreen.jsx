import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { lightTheme } from '../../theme';

const LoginScreen = ({ navigation }) => {
  const { login, isLoading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Basic validation
    if (!email.trim() || !password) return;
    
    const success = await login(email.trim(), password);
    // Note: If success=true, the RootNavigator automatically switches to the App stack
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Area */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={48} color={lightTheme.colors.primary} />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Enter your details to sign in to Nivara</Text>
          </View>

          {/* Error Banner */}
          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={lightTheme.colors.status.emergency} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            <AppInput
              label="Email Address"
              icon="mail-outline"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />
            
            <AppInput
              label="Password"
              icon="lock-closed-outline"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoComplete="password"
              editable={!isLoading}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <AppButton
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.AUTH.REGISTER)} disabled={isLoading}>
              <Text style={styles.linkText}>Create one</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: lightTheme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: lightTheme.spacing.xl,
    marginTop: lightTheme.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: lightTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: lightTheme.spacing.lg,
  },
  title: {
    ...lightTheme.typography.h1,
    color: lightTheme.colors.text.primary,
    marginBottom: lightTheme.spacing.xs,
  },
  subtitle: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.status.emergencyBg,
    padding: lightTheme.spacing.md,
    borderRadius: lightTheme.borderRadius.md,
    marginBottom: lightTheme.spacing.lg,
  },
  errorText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.status.emergency,
    marginLeft: lightTheme.spacing.sm,
    flex: 1,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: lightTheme.spacing.xl,
    marginTop: -lightTheme.spacing.sm,
  },
  forgotPasswordText: {
    ...lightTheme.typography.body2,
    color: lightTheme.colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: lightTheme.spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: lightTheme.spacing.xl,
    paddingBottom: lightTheme.spacing.lg,
  },
  footerText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
  },
  linkText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;
