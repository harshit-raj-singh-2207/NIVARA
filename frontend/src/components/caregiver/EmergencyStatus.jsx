/**
 * EmergencyStatus.jsx
 * Highlighted emergency alert status banner for SOS triggers or geofence breaches.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const EmergencyStatus = ({ alert, onViewMap, onContactUser, onDismiss }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!alert) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.status.errorBackground,
          borderColor: colors.status.error,
          borderRadius: borderRadius.lg,
          padding: 12,
          marginBottom: 12,
          ...shadows.medium,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={{ fontSize: 26, marginRight: 8 }}>🚨</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.status.error, fontSize: typography.sizes.xs, fontWeight: '900', letterSpacing: 0.5 }}>
            CRITICAL EMERGENCY SOS ALERT
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.bold,
              marginTop: 2,
            }}
          >
            {alert.title || 'Dependent Triggered Emergency Panic Signal'}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
            {alert.message || 'User activated SOS button. Immediate caregiver attention required.'}
          </Text>
        </View>

        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn}>
            <Text style={{ color: colors.textMuted, fontSize: 16, fontWeight: 'bold' }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Immediate Caregiver Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onViewMap}
          style={[
            styles.actionBtn,
            {
              backgroundColor: colors.status.error,
              borderRadius: borderRadius.md,
              marginRight: 8,
            },
          ]}
        >
          <Text style={{ color: '#FFFFFF', fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            🗺️ View GPS Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onContactUser}
          style={[
            styles.actionBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Text style={{ color: '#FFFFFF', fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            📞 Contact User
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderWidth: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dismissBtn: {
    padding: 4,
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(239, 68, 68, 0.2)',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EmergencyStatus;
