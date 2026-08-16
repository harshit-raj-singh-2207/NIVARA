import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

import { navigationRef } from './src/navigation/navigationRef';
import MainNavigator from './src/navigation/MainNavigator';
import { useAppStore } from './src/store/appStore';

export default function App() {
  useEffect(() => {
    // Hide splash screen automatically now that navigation structures exist
    SplashScreen.hideAsync().catch(console.error);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} theme={DefaultTheme}>
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}