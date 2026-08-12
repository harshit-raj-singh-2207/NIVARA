/**
 * LocationCard.jsx
 * Displays live GPS address, coordinates, and safe zone status.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const LocationCard = ({ location }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  const address = location?.address || '124 Sensory Safe Haven, Innovation Hub, Tech City';
  const isInside = location?.isInsideSafeZone ?? true;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isInside ? colors.status.success : colors.status.warning,
          borderRadius: borderRadius.lg,
          padding: 12,
          marginBottom: 12,
          ...shadows.small,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 24, marginRight: 8 }}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.sm, fontWeight: 'bold' }}>
            Current Live Location
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
            {address}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: isInside ? colors.status.successBackground : colors.status.warningBackground,
              borderColor: isInside ? colors.status.success : colors.status.warning,
              borderRadius: borderRadius.sm,
              paddingHorizontal: 8,
              paddingVertical: 4,
            },
          ]}
        >
          <Text
            style={{
              color: isInside ? colors.status.success : colors.status.warning,
              fontSize: 10,
              fontWeight: 'bold',
            }}
          >
            {isInside ? 'INSIDE SAFE ZONE' : 'OUTSIDE ZONE'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    borderWidth: 1,
  },
});

export default LocationCard;
