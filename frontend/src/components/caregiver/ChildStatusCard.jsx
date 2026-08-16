import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ChildStatusCard = ({ childName, status, lastUpdate }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={48} color={colors.primary} />
        <View style={styles.textBlock}>
          <Text style={[styles.name, { color: colors.text }]}>{childName || "Dependent Profile"}</Text>
          <Text style={[styles.update, { color: colors.text }]}>Last seen: {lastUpdate || "Just now"}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status === 'safe' ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={[styles.statusText, { color: status === 'safe' ? '#166534' : '#991b1b' }]}>
            {status === 'safe' ? 'SAFE' : 'ALERT'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    padding: 20, 
    borderRadius: 24, 
    borderWidth: 1, 
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  header: { flexDirection: 'row', alignItems: 'center' },
  textBlock: { flex: 1, marginLeft: 16 },
  name: { fontSize: 20, fontWeight: '800' },
  update: { fontSize: 13, opacity: 0.6, marginTop: 4, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }
});

export default ChildStatusCard;
