import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const EmergencyContactCard = ({ contact }) => {
  const { colors } = useTheme();
  
  const handleCall = () => {
    if (contact?.phone) {
      Linking.openURL(`tel:${contact.phone}`);
    }
  };

  const name = contact?.name || "Emergency Contact";
  const relation = contact?.relation || "Caregiver";

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.infoBlock}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.relation, { color: colors.text }]}>{relation}</Text>
      </View>
      <TouchableOpacity onPress={handleCall} style={[styles.callBtn, { backgroundColor: '#ef4444' }]} activeOpacity={0.8}>
        <Ionicons name="call" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    alignItems: 'center', 
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  infoBlock: { flex: 1 },
  name: { fontSize: 18, fontWeight: '700' },
  relation: { fontSize: 14, opacity: 0.6, marginTop: 4, fontWeight: '500' },
  callBtn: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});

export default EmergencyContactCard;
