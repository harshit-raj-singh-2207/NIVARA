import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';

export const AboutScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="About NIVARA" showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <AppCard variant="elevated" style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>🌌</Text>
          <Text style={{ color: colors.text, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold }}>
            NIVARA Safety & Communication
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm, marginTop: 4 }}>
            Version 1.0.0 (Build 2026)
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm, textAlign: 'center', marginTop: 12, lineHeight: 20 }}>
            AI-Powered sensory adaptation, emergency safety tracking, and non-verbal communication for users and caregivers.
          </Text>
        </AppCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default AboutScreen;
