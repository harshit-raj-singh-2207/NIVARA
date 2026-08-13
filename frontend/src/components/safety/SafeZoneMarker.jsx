import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';

/**
 * Interactive Map Marker used specifically when creating or editing a Safe Zone.
 * Ties a Marker and a Circle together so the user can visualize the exact boundary radius.
 *
 * @param {Object} props
 * @param {import('../../types/safety').LocationCoords} props.coordinate - Where the pin is currently placed
 * @param {number} props.radius - The radius of the geofence in meters
 * @param {boolean} [props.draggable=false] - Whether the user can drag the pin around the map
 * @param {Function} [props.onDragEnd] - Callback returning new coordinates after drag finishes
 */
const SafeZoneMarker = ({
  coordinate,
  radius,
  draggable = false,
  onDragEnd,
}) => {
  if (!coordinate) return null;

  return (
    <>
      <Circle
        center={coordinate}
        radius={radius}
        strokeWidth={2}
        strokeColor={lightTheme.colors.primary}
        fillColor="rgba(14, 165, 233, 0.25)" // Slightly darker than the regular map overlay
      />

      <Marker
        coordinate={coordinate}
        draggable={draggable}
        onDragEnd={(e) => {
          if (onDragEnd && e.nativeEvent.coordinate) {
            onDragEnd(e.nativeEvent.coordinate);
          }
        }}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <View style={styles.pinContainer}>
          <View style={styles.pinInner}>
            <Ionicons name="location" size={16} color="#fff" />
          </View>
        </View>
      </Marker>
    </>
  );
};

const styles = StyleSheet.create({
  pinContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: lightTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...lightTheme.shadows.md,
  },
});

export default SafeZoneMarker;
