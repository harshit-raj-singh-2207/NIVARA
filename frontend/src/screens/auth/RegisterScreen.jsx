import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { lightTheme } from '../../theme';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) return;
    
    // Attempt registration
    const success = await register(name.trim(), email.trim(), password);
    
    if (success) {
      // 1. App remains in Auth Stack because user.role is still null!
      // 2. Navigate exactly to the Role Selection screen to proceed onboarding
      navigation.navigate(ROUTES.AUTH.ROLE_SELECTION);
    }
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <AppHeader title="" showBack />
      
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Nivara to enhance personal safety and independent living</Text>
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
              label="Full Name"
              icon="person-outline"
              placeholder="e.g. Jane Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
            />

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
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoComplete="password-new"
              editable={!isLoading}
            />

            <AppButton
              title="Create Account"
              onPress={handleRegister}
              isLoading={isLoading}
              style={styles.registerButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.AUTH.LOGIN)} disabled={isLoading}>
              <Text style={styles.linkText}>Sign In</Text>
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
    paddingHorizontal: lightTheme.spacing.xl,
    paddingBottom: lightTheme.spacing.xl,
  },
  header: {
    marginBottom: lightTheme.spacing.xl,
    marginTop: lightTheme.spacing.sm,
  },
  title: {
    ...lightTheme.typography.h1,
    color: lightTheme.colors.text.primary,
    marginBottom: lightTheme.spacing.xs,
  },
  subtitle: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.secondary,
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
  registerButton: {
    marginTop: lightTheme.spacing.md,
    marginBottom: lightTheme.spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: lightTheme.spacing.xl,
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

export default RegisterScreen;
