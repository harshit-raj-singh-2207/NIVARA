/**
 * AppNavigator.jsx
 * Root Application Navigation Container for NIVARA AI-Powered Safety & Communication system.
 * Handles state-based navigation guards, JWT token session restoration, and deep-linking routing.
 *
 * @module navigation/AppNavigator
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../store/authStore';
import { navigationRef } from './navigationRef';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/auth/SplashScreen';

const RootStack = createNativeStackNavigator();

/**
 * Deep-linking configuration for emergency notifications, geofence redirects, and external links.
 */

const linking = {
  prefixes: ['nivara://', 'https://nivara.app'],
  config: {
    screens: {
      MainApp: {
        screens: {
          HomeTab: {
            screens: {
              HomeScreen: 'home',
              NotificationsScreen: 'notifications',
            },
          },
          CommunityTab: 'community',
          ProfileTab: {
            screens: {
              ProfileScreen: 'profile',
              SettingsScreen: 'settings',
              EditProfileScreen: 'profile/edit',
            },
          },
        },
      },
      Auth: {
        screens: {
          LoginScreen: 'login',
          RegisterScreen: 'register',
          CaregiverVerification: 'verify-caregiver',
          ForgotPasswordScreen: 'forgot-password',
        },
      },
    },
  },
};

/**
 * Root AppNavigator Component.
 * Dynamically switches between AuthNavigator and MainNavigator based on store authentication state.
 *
 * @returns {React.ReactElement}
 */
export const AppNavigator = () => {
  const { isAuthenticated, isLoading, isInitialized, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Render SplashScreen while restoring JWT session token from storage
  if (!isInitialized || isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          <RootStack.Screen name="MainApp" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
