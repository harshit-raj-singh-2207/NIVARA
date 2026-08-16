import React from 'react';
import { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SafeZoneMarker = ({ coordinate, name }) => {
  return (
    <Marker coordinate={coordinate} title={name || "Safe Zone"}>
      <View style={styles.markerContainer}>
        <Ionicons name="home" size={16} color="#ffffff" />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: '#10b981', // green indicating safety
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});
export default SafeZoneMarker;
