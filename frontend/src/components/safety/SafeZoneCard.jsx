/**
 * SafeZoneCard.jsx
 * Safe Zone / Geofence configuration card component.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const SafeZoneCard = ({ zone, onPress }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  if (!zone) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: zone.active ? colors.primary : colors.border,
          borderRadius: borderRadius.md,
          padding: 10,
          marginBottom: 8,
          ...shadows.small,
        },
      ]}
    >
      <View style={styles.leftRow}>
        <Text style={{ fontSize: 20, marginRight: 8 }}>🏡</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.sizes.xs,
              fontWeight: typography.weights.bold,
            }}
          >
            {zone.name || 'Home Geofence Zone'}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 10, marginTop: 2 }}>
            Radius: {zone.radiusMeters || 500}m • Alert: Multi-Caregiver
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: zone.active ? colors.status.successBackground : colors.surface,
              borderColor: zone.active ? colors.status.success : colors.border,
              borderRadius: borderRadius.sm,
              paddingHorizontal: 6,
              paddingVertical: 2,
            },
          ]}
        >
          <Text
            style={{
              color: zone.active ? colors.status.success : colors.textMuted,
              fontSize: 9,
              fontWeight: 'bold',
            }}
          >
            {zone.active ? 'ACTIVE' : 'INACTIVE'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
  badge: {
    borderWidth: 1,
  },
});

export default SafeZoneCard;
