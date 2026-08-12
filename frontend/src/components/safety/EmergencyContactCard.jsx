/**
 * EmergencyContactCard.jsx
 * Caregiver emergency contact card component with quick call & message actions.
 */

import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const EmergencyContactCard = ({ contact, onCall, onMessage }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!contact) return null;

  const handleCall = () => {
    if (onCall) {
      onCall(contact);
    } else {
      Alert.alert('📞 Calling Caregiver', `Dialing ${contact.name} (${contact.phone || 'Emergency Contact'})`);
    }
  };

  const handleMessage = () => {
    if (onMessage) {
      onMessage(contact);
    } else {
      Alert.alert('💬 Messaging Caregiver', `Sending SMS alert to ${contact.name}`);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: 10,
          marginBottom: 8,
          ...shadows.small,
        },
      ]}
    >
      <View style={styles.leftRow}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: colors.primaryLight,
              borderRadius: borderRadius.full,
            },
          ]}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }}>
            {contact.name ? contact.name.charAt(0).toUpperCase() : 'C'}
          </Text>
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.xs,
              fontWeight: typography.weights.bold,
            }}
          >
            {contact.name} {contact.isPrimary ? '⭐ (Primary)' : ''}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 10, marginTop: 2 }}>
            {contact.relationship || 'Caregiver'} • {contact.phone || 'Primary Phone'}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={handleCall} style={[styles.actionBtn, { backgroundColor: colors.status.success }]}>
            <Text style={{ fontSize: 14 }}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMessage} style={[styles.actionBtn, { backgroundColor: colors.primary, marginLeft: 6 }]}>
            <Text style={{ fontSize: 14 }}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EmergencyContactCard;
