import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import AppHeader from './AppHeader';
export default function FeatureScreen({ navigation, title, subtitle, children }) {
  const { theme } = useTheme();
  return <View style={[styles.root, { backgroundColor: theme.colors.background }]}><AppHeader title={title} subtitle={subtitle} showBack onBackPress={() => navigation.goBack()} /><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.body, { padding: theme.spacing.lg }]}>{children}</ScrollView></View>;
}
export function SectionTitle({ children }) { const { theme } = useTheme(); return <Text accessibilityRole="header" style={{ color: theme.colors.text, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.bold, marginTop: theme.spacing.sm, marginBottom: theme.spacing.sm }}>{children}</Text>; }
const styles = StyleSheet.create({ root: { flex: 1 }, body: { paddingBottom: 48 } });
