import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import AppHeader from './AppHeader';
export default function FeatureScreen({ navigation, title, subtitle, children }) {
  const { theme } = useTheme();
  return <View style={[styles.root, { backgroundColor: theme.colors.background }]}><AppHeader showBack onBackPress={() => navigation?.goBack()} /><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingHorizontal: theme.spacing.lg }]}><View style={styles.hero}><Text accessibilityRole="header" style={[styles.title,{color:theme.colors.text,fontSize:theme.typography.sizes.h2,fontWeight:theme.typography.weights.bold}]}>{title}</Text>{subtitle?<Text style={[styles.subtitle,{color:theme.colors.textSecondary,fontSize:theme.typography.sizes.md}]}>{subtitle}</Text>:null}</View>{children}</ScrollView></View>;
}
export function SectionTitle({ children }) { const { theme } = useTheme(); return <Text accessibilityRole="header" style={{ color: theme.colors.text, fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.bold, marginTop: theme.spacing.lg, marginBottom: theme.spacing.base }}>{children}</Text>; }
const styles = StyleSheet.create({ root:{flex:1},body:{width:'100%',maxWidth:920,alignSelf:'center',paddingBottom:64},hero:{paddingTop:20,paddingBottom:18},title:{letterSpacing:-0.8,lineHeight:40},subtitle:{lineHeight:24,marginTop:8,maxWidth:620} });
