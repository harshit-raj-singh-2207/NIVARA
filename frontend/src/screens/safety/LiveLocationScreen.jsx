import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import * as Location from 'expo-location';
import LocationMap from '../../components/safety/LocationMap';

const LiveLocationScreen = () => {
  const { colors } = useTheme();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Live Tracking</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Monitoring exact physical location.</Text>
      </View>
      
      <View style={[styles.mapWrapper, { borderColor: colors.border }]}>
        {errorMsg ? (
          <View style={styles.center}>
             <Text style={{ color: 'red' }}>{errorMsg}</Text>
          </View>
        ) : location ? (
          <LocationMap currentLocation={location} />
        ) : (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Acquiring GPS Signal...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: { 
    padding: 20,
    paddingBottom: 10,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800' 
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    marginTop: 4,
  },
  mapWrapper: { 
    flex: 1, 
    margin: 20,
    marginTop: 10,
    borderRadius: 24, 
    overflow: 'hidden', 
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontWeight: '500',
    opacity: 0.7,
  }
});

export default LiveLocationScreen;
