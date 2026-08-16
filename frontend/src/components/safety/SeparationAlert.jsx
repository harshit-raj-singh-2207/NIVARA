import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SeparationAlert = ({ onDismiss, distance }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="warning" size={32} color="#fff" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Separation Alert!</Text>
        <Text style={styles.subtitle}>Wander tracking active. Moved {distance || '?'}m away.</Text>
      </View>
      <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn}>
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    backgroundColor: '#f43f5e', // Vibrant rose danger
    elevation: 8,
    shadowColor: '#f43f5e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  icon: { marginRight: 16 },
  textContainer: { flex: 1 },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  subtitle: { color: '#fff', fontSize: 14, opacity: 0.9, marginTop: 2 },
  dismissBtn: { padding: 4 }
});
export default SeparationAlert;
