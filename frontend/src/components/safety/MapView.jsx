import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';

/**
 * Reusable Map Component wrapping react-native-maps.
 * Handles rendering the user's location pin and drawing Safe Zone boundaries.
 *
 * @param {Object} props
 * @param {import('../../types/safety').LocationCoords} props.location - The main coordinate to center/pin
 * @param {import('../../types/safety').SafeZone[]} [props.safeZones=[]] - Array of zones to draw
 * @param {boolean} [props.scrollEnabled=true]
 * @param {boolean} [props.zoomEnabled=true]
 * @param {number} [props.height=200]
 */
const AppMapView = ({
  location,
  safeZones = [],
  scrollEnabled = true,
  zoomEnabled = true,
  height = 250,
  style,
}) => {
  const mapRef = useRef(null);

  // Default to a wide view of user location or a fallback (e.g. Center of US/UK)
  const initialRegion = {
    latitude: location?.latitude || 37.7749,
    longitude: location?.longitude || -122.4194,
    latitudeDelta: 0.015, // Zoom level
    longitudeDelta: 0.015,
  };

  // Animate map to new location if it updates from the outside
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 1000);
    }
  }, [location]);

  return (
    <View style={[styles.container, { height }, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation={false} // We draw our own custom marker
        showsMyLocationButton={false}
        scrollEnabled={scrollEnabled}
        zoomEnabled={zoomEnabled}
        pitchEnabled={false}
        toolbarEnabled={false}
        // customMapStyle={customMapStyleJson} // Optional: Pass a generated JSON to match darkTheme/lightTheme
      >
        
        {/* Render Safe Zones (Geofence Boundaries) */}
        {safeZones.map((zone) => (
          <Circle
            key={zone.id}
            center={{ latitude: zone.latitude, longitude: zone.longitude }}
            radius={zone.radius}
            strokeWidth={2}
            strokeColor={lightTheme.colors.primary}
            fillColor="rgba(14, 165, 233, 0.15)" // primary color with opacity
          />
        ))}

        {/* Render Target User's Pin */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            {/* Custom Marker UI - a pulsing dot or just a nice themed icon */}
            <View style={styles.markerContainer}>
              <View style={styles.markerInner}>
                <Ionicons name="person" size={16} color="#fff" />
              </View>
            </View>
          </Marker>
        )}

      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: lightTheme.borderRadius.lg,
    overflow: 'hidden', // Ensures map obeys border radius
    backgroundColor: lightTheme.colors.surfaceHover,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(14, 165, 233, 0.3)', // primary with opacity for glow effect
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: lightTheme.colors.primary,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppMapView;
