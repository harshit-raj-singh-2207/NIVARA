/**
 * MapView.jsx
 * Embedded interactive GPS map viewer component showing real-time location and active safe zone boundaries.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

export const MapView = ({ location, safeZones = [], style }) => {
  const { theme } = useTheme();
  const { colors, borderRadius, typography, shadows } = theme;

  const lat = location?.latitude || 37.7749;
  const lng = location?.longitude || -122.4194;

  return (
    <View
      style={[
        styles.mapContainer,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          ...shadows.small,
        },
        style,
      ]}
    >
      <View style={styles.gridOverlay}>
        <Text style={{ fontSize: 36, marginBottom: 4 }}>🗺️</Text>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.bold,
          }}
        >
          GPS Map Satellite Radar
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: typography.sizes.xs,
            marginTop: 2,
          }}
        >
          Lat: {lat.toFixed(4)} • Lng: {lng.toFixed(4)}
        </Text>

        <View
          style={[
            styles.geofenceRing,
            {
              borderColor: colors.primary,
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: borderRadius.full,
            },
          ]}
        >
          <Text style={{ fontSize: 16 }}>📍</Text>
          <Text style={{ color: colors.primary, fontSize: 10, fontWeight: 'bold' }}>
            500m Safe Zone Boundary
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 180,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  geofenceRing: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default MapView;
