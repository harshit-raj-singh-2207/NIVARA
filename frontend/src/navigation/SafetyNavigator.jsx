import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SafetyHomeScreen from '../screens/safety/SafetyHomeScreen';
import EmergencyScreen from '../screens/safety/EmergencyScreen';
import LiveLocationScreen from '../screens/safety/LiveLocationScreen';
import SafeZonesScreen from '../screens/safety/SafeZonesScreen';
import AddSafeZoneScreen from '../screens/safety/AddSafeZoneScreen';
import GPSBandScreen from '../screens/safety/GPSBandScreen';
import EmergencyContactsScreen from '../screens/safety/EmergencyContactsScreen';

const Stack = createNativeStackNavigator();

export const SafetyNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SafetyMain" component={SafetyHomeScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="LiveLocation" component={LiveLocationScreen} />
      <Stack.Screen name="SafeZones" component={SafeZonesScreen} />
      <Stack.Screen name="AddSafeZone" component={AddSafeZoneScreen} />
      <Stack.Screen name="GPSBand" component={GPSBandScreen} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
    </Stack.Navigator>
  );
};

export default SafetyNavigator;
