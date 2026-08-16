import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';

// Screens
import SafetyHomeScreen from '../screens/safety/SafetyHomeScreen';
import GPSBandScreen from '../screens/safety/GPSBandScreen';
import SafeZonesScreen from '../screens/safety/SafeZonesScreen';
import AddSafeZoneScreen from '../screens/safety/AddSafeZoneScreen';
import EmergencyContactsScreen from '../screens/safety/EmergencyContactsScreen';
import SafetyEventDetailsScreen from '../screens/safety/SafetyEventDetailsScreen';
import EmergencyScreen from '../screens/safety/EmergencyScreen';

const Stack = createNativeStackNavigator();

/**
 * Main Navigator for the "Supported Individual" (Safety) role.
 * Uses a Native Stack to transition smoothly between home, settings, and emergencies.
 */
const SafetyNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SAFETY.HOME}
      screenOptions={{
        headerShown: false, // We use our custom AppHeader on every screen
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name={ROUTES.SAFETY.HOME} 
        component={SafetyHomeScreen} 
      />
      <Stack.Screen 
        name={ROUTES.SAFETY.GPS_BAND} 
        component={GPSBandScreen} 
      />
      <Stack.Screen 
        name={ROUTES.SAFETY.SAFE_ZONES} 
        component={SafeZonesScreen} 
      />
      
      {/* Typically, creating something new slides up from the bottom (modal style) on iOS */}
      <Stack.Screen 
        name={ROUTES.SAFETY.ADD_SAFE_ZONE} 
        component={AddSafeZoneScreen}
        options={{ animation: 'slide_from_bottom' }} 
      />
      
      <Stack.Screen 
        name={ROUTES.SAFETY.CONTACTS} 
        component={EmergencyContactsScreen} 
      />
      <Stack.Screen 
        name={ROUTES.SAFETY.EVENT_DETAILS} 
        component={SafetyEventDetailsScreen} 
      />

      {/* Emergency Screen is presented as a full-screen block to demand attention */}
      <Stack.Screen 
        name={ROUTES.SAFETY.EMERGENCY_ACTIVE} 
        component={EmergencyScreen}
        options={{ 
          animation: 'fade', 
          gestureEnabled: false // Prevent swiping away an active SOS!
        }} 
      />
    </Stack.Navigator>
  );
};

export default SafetyNavigator;
