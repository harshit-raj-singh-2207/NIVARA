import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CaregiverAlertCard = ({ title, message, severity = 'warning' }) => {
  const color = severity === 'danger' ? '#ef4444' : '#f59e0b';
  
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Ionicons name="warning" size={28} color={color} style={styles.icon} />
      <View style={styles.content}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 16, borderLeftWidth: 6, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  icon: { marginRight: 16 },
  content: { flex: 1 },
  title: { fontWeight: '800', fontSize: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  message: { fontSize: 15, color: '#4b5563', lineHeight: 22, fontWeight: '500' }
});
export default CaregiverAlertCard;
