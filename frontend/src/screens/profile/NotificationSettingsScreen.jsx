import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';

export const NotificationSettingsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Notification Settings" showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <AppCard variant="elevated">
          <Text style={{ color: colors.text, fontSize: typography.sizes.md, fontWeight: typography.weights.bold }}>
            🔔 Alert Preferences
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm, marginTop: 8 }}>
            Configure emergency push alerts, sensory overload warnings, and routine transition reminders.
          </Text>
        </AppCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default NotificationSettingsScreen;
