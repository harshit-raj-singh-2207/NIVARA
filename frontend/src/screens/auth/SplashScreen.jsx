/**
 * Splash Screen for NIVARA.
 * Displays app branding and automatically navigates to Onboarding or Login.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { AUTH_ROUTES } from '../../constants/routes';

export const SplashScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  useEffect(() => {
    if (navigation && navigation.replace) {
      const timer = setTimeout(() => {
        navigation.replace(AUTH_ROUTES.ONBOARDING);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary, fontSize: typography.sizes.h1 }]}>
        NIVARA
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.sizes.sm }]}>
        AI-Powered Communication, Learning & Safety Ecosystem
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontWeight: '800',
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SplashScreen;
