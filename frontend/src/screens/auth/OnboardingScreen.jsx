/**
 * Onboarding Screen for NIVARA.
 * Highlights core features (Emotion AI AAC, Sensory Controls, Smart Safety, Caregiver Pairing).
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { AUTH_ROUTES } from '../../constants/routes';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';

export const OnboardingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const features = [
    {
      icon: '🗣️',
      title: 'Emotion-Aware AI Communication',
      description: 'AAC symbol boards, predictive phrases, and real-time voice synthesis.',
    },
    {
      icon: '🧠',
      title: 'Adaptive Learning Assistant',
      description: 'Personalized routines, gamified sensory tasks, and cognitive growth.',
    },
    {
      icon: '🛡️',
      title: 'Smart Safety & Emergency System',
      description: 'One-tap SOS alerts, automatic geofencing, and fall detection warnings.',
    },
    {
      icon: '🤝',
      title: 'Personalized Caregiver Ecosystem',
      description: 'Real-time telemetry pairing, sensory log insights, and remote safety monitoring.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.h2 }]}>
            Welcome to NIVARA
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.sizes.sm }]}>
            Empowering individuals and caregivers with adaptive AI technology.
          </Text>
        </View>

        <View style={{ marginVertical: spacing.md }}>
          {features.map((item, index) => (
            <AppCard key={index} variant="elevated" style={{ marginBottom: spacing.md }}>
              <View style={styles.featureRow}>
                <Text style={styles.featureIcon}>{item.icon}</Text>
                <View style={styles.featureTextWrapper}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: typography.sizes.md,
                      fontWeight: typography.weights.bold,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: typography.sizes.xs,
                      marginTop: 4,
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            </AppCard>
          ))}
        </View>

        <View style={[styles.footer, { marginTop: spacing.md }]}>
          <AppButton
            title="Get Started / Sign In"
            onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN)}
            variant="primary"
            size="large"
            style={{ marginBottom: spacing.sm }}
          />
          <AppButton
            title="Create New Account"
            onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER)}
            variant="secondary"
            size="large"
          />
        </View>
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
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  featureTextWrapper: {
    flex: 1,
  },
  footer: {
    width: '100%',
  },
});

export default OnboardingScreen;
