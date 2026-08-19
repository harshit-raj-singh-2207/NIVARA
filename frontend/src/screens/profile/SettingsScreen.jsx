import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/appStore';

const SettingRow = ({ title, description, value, onToggle }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.rowDesc, { color: colors.text }]}>{description}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onToggle} 
        trackColor={{ true: colors.primary, false: colors.border }} 
      />
    </View>
  );
};

const SettingsScreen = () => {
  const { colors } = useTheme();
  const { theme, setTheme } = useAppStore();
  
  const isDarkMode = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <Text style={[styles.header, { color: colors.text }]}>App Settings</Text>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Appearance & Theme</Text>
        <SettingRow 
          title="Dark Mode Engine" 
          description="Use a darker theme across the app to reduce eye strain."
          value={isDarkMode}
          onToggle={(val) => setTheme(val ? 'dark' : 'light')}
        />
        <SettingRow 
          title="High Contrast Colors" 
          description="Increase the contrast of buttons and text for visibility."
          value={false}
          onToggle={() => {}}
        />

        <Text style={[styles.sectionTitle, { color: colors.primary, marginTop: 32 }]}>Sensory & Notifications</Text>
        <SettingRow 
          title="Critical Push Notifications" 
          description="Receive background alerts and caregiver geofencing updates."
          value={true}
          onToggle={() => {}}
        />
        <SettingRow 
          title="Vibration & Haptics" 
          description="Provide physical feedback when tapping elements or triggering alerts."
          value={true}
          onToggle={() => {}}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 32, fontWeight: '800', marginHorizontal: 20, marginTop: 10, marginBottom: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, paddingVertical: 16 },
  rowText: { flex: 1, paddingRight: 16 },
  rowTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  rowDesc: { fontSize: 14, opacity: 0.6, lineHeight: 20 }
});

export default SettingsScreen;
