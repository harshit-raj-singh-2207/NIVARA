import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';

// Screens
import CaregiverDashboard from '../screens/caregiver/CaregiverDashboard';
import ChildProfileScreen from '../screens/caregiver/ChildProfileScreen';
import PreferencesScreen from '../screens/caregiver/PreferencesScreen';

const Stack = createNativeStackNavigator();

/**
 * Main Navigator for the "Caregiver" role.
 * Links the high-level dashboard to deep-dive child profiles and alert settings.
 */
const CaregiverNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.CAREGIVER.DASHBOARD}
      screenOptions={{
        headerShown: false, // We use our custom AppHeader on every screen
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name={ROUTES.CAREGIVER.DASHBOARD} 
        component={CaregiverDashboard} 
      />
      
      {/* 
        This screen expects `childId` in route.params so it knows 
        which profile to load from the Zustand store.
      */}
      <Stack.Screen 
        name={ROUTES.CAREGIVER.CHILD_STATUS} 
        component={ChildProfileScreen} 
      />
      
      <Stack.Screen 
        name={ROUTES.CAREGIVER.PREFERENCES} 
        component={PreferencesScreen}
        options={{ animation: 'slide_from_bottom' }} // Settings usually slide up from bottom
      />
    </Stack.Navigator>
  );
};

export default CaregiverNavigator;
