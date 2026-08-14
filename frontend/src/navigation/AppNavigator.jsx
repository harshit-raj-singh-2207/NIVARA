import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { navigationRef } from './navigationRef';
import useAuthStore from '../store/authStore';
import Loading from '../components/common/Loading';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isAuthenticated, isRestoringSession, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  if (isRestoringSession) {
    return <Loading text="Restoring session..." />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainApp" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
