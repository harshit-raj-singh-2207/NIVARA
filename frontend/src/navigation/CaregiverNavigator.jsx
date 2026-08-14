import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CaregiverDashboard from '../screens/caregiver/CaregiverDashboard';
import ChildProfileScreen from '../screens/caregiver/ChildProfileScreen';
import ChildStatusScreen from '../screens/caregiver/ChildStatusScreen';
import RoutineOverviewScreen from '../screens/caregiver/RoutineOverviewScreen';
import DeviceStatusScreen from '../screens/caregiver/DeviceStatusScreen';
import CaregiverPreferencesScreen from '../screens/caregiver/CaregiverPreferencesScreen';
import CaregiverContactsScreen from '../screens/caregiver/CaregiverContactsScreen';

const Stack = createNativeStackNavigator();

export const CaregiverNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CaregiverMain" component={CaregiverDashboard} />
      <Stack.Screen name="ChildProfile" component={ChildProfileScreen} />
      <Stack.Screen name="ChildStatus" component={ChildStatusScreen} />
      <Stack.Screen name="RoutineOverview" component={RoutineOverviewScreen} />
      <Stack.Screen name="DeviceStatus" component={DeviceStatusScreen} />
      <Stack.Screen name="CaregiverPreferences" component={CaregiverPreferencesScreen} />
      <Stack.Screen name="CaregiverContacts" component={CaregiverContactsScreen} />
    </Stack.Navigator>
  );
};

export default CaregiverNavigator;
