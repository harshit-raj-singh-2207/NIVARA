/**
 * CurrentLocationCard.jsx
 * Live GPS coordinates & Geofence safe zone status card for caregiver monitoring.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export const CurrentLocationCard = ({ location, onViewMap }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  const address = location?.address || '124 Sensory Safe Haven, Innovation Hub, Tech City';
  const isInside = location?.isInsideSafeZone ?? true;
  const lastUpdated = location?.lastUpdated || 'Just now';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isInside ? colors.status.success : colors.status.error,
          borderRadius: borderRadius.lg,
          padding: 12,
          marginBottom: 12,
          ...shadows.small,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 22, marginRight: 8 }}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: typography.sizes.sm, fontWeight: 'bold' }}>
            Dependent Live GPS Location
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 2 }}>
            {address}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onViewMap}
          style={[
            styles.viewMapBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Text style={{ color: '#FFFFFF', fontSize: typography.sizes.xs, fontWeight: 'bold' }}>
            View Map
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerRow}>
        <Text
          style={{
            color: isInside ? colors.status.success : colors.status.error,
            fontSize: 11,
            fontWeight: 'bold',
          }}
        >
          {isInside ? '✓ Inside Safe Zone Boundary' : '⚠️ OUTSIDE GEOFENCE ZONE!'}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 10 }}>
          Updated: {lastUpdated}
        </Text>
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
  viewMapBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});

export default CurrentLocationCard;
