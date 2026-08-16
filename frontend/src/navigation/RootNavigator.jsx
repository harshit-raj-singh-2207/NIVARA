import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';

// Role-based Navigators
import SafetyNavigator from './SafetyNavigator';
import CaregiverNavigator from './CaregiverNavigator';

import AuthNavigator from './AuthNavigator';
import { lightTheme } from '../theme';


const Stack = createNativeStackNavigator();

/**
 * The Root Navigator.
 * This component acts as the global switch. It reads the JWT/Auth state 
 * and user role (Caregiver vs. Safety User) from Zustand, and mounts 
 * the appropriate Navigation Stack.
 */
const RootNavigator = () => {
  // useAuth will be built in Part 3. We'll mock it for now based on what we know we need.
  const { user, isLoading, isHydrating } = useAuth();

  // If Zustand is still rehydrating from Async Storage on app boot, show nothing
  // (The expo splash screen in App.jsx will hide this anyway)
  if (isHydrating || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={lightTheme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. Unauthenticated Route */}
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        /* 2. Authenticated Routes - Split by Role */
        <>
          {user?.role === 'caregiver' ? (
            <Stack.Screen name="CaregiverRoot" component={CaregiverNavigator} />
          ) : (
            <Stack.Screen name="SafetyRoot" component={SafetyNavigator} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: lightTheme.colors.background,
  }
});

export default RootNavigator;
