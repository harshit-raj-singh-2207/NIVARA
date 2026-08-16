import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';

const Stack = createNativeStackNavigator();

/**
 * Authentication Stack.
 * Handles the flow for unauthenticated users: Login, Register, and Onboarding.
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.AUTH.LOGIN}
      screenOptions={{
        headerShown: false,
        animation: 'fade', // Better for auth transitions
      }}
    >
      <Stack.Screen name={ROUTES.AUTH.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.AUTH.REGISTER} component={RegisterScreen} />
      <Stack.Screen 
        name={ROUTES.AUTH.ROLE_SELECTION} 
        component={RoleSelectionScreen} 
        options={{ gestureEnabled: false }} // Prevent swiping back to registration!
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
