import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const LocationMap = ({ currentLocation = null, safeZones = [] }) => {
  const { colors } = useTheme();

  // Default to a central fallback if no location is available yet
  const initialRegion = {
    latitude: currentLocation?.latitude || 37.78825,
    longitude: currentLocation?.longitude || -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Render precise custom custom marker for current location */}
        {currentLocation && (
          <Marker coordinate={currentLocation} title="You are here">
            <View style={[styles.markerBody, { backgroundColor: colors.primary }]}>
              <Ionicons name="person" size={16} color="#fff" />
            </View>
          </Marker>
        )}

        {/* Render precise Safe Zones in green */}
        {safeZones.map((zone, index) => (
          <React.Fragment key={index}>
             <Circle 
               center={zone.coordinate}
               radius={zone.radius || 500}
               fillColor="rgba(74, 222, 128, 0.25)"
               strokeColor="#4ade80"
               strokeWidth={2}
               zIndex={1}
             />
          </React.Fragment>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    width: '100%', 
    height: '100%',
    backgroundColor: '#e2e8f0', // placeholder loading color 
  },
  map: { 
    width: '100%', 
    height: '100%',
  },
  markerBody: { 
    padding: 6, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }
});

export default LocationMap;
