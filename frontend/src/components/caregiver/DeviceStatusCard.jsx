import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const DeviceStatusCard = ({ battery = 85, isConnected = true, deviceType = "GPS Band" }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="watch" size={24} color={colors.primary} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: colors.text }]}>{deviceType}</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          {isConnected ? `Connected • ${battery}% Battery` : "Disconnected"}
        </Text>
      </View>
      <Ionicons 
        name={battery > 20 ? "battery-full" : "battery-dead"} 
        size={28} 
        color={battery > 20 ? '#10b981' : '#ef4444'} 
      />
    </View>
  );
};
const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 12 },
  iconContainer: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#3b82f615', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  details: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 14, opacity: 0.6, marginTop: 4, fontWeight: '500' }
});
export default DeviceStatusCard;
