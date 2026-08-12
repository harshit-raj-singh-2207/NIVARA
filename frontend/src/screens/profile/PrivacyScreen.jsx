import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';

export const PrivacyScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Privacy & Safety Rules" showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <AppCard variant="elevated" style={{ marginBottom: spacing.md }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.md, fontWeight: typography.weights.bold }}>
            🛡️ Privacy & Safety Guidelines
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm, marginTop: 8, lineHeight: 22 }}>
            NIVARA ensures end-to-end data encryption for all emergency location broadcasts, sensory thresholds, and caregiver communications.
          </Text>
        </AppCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default PrivacyScreen;
