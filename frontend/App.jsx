import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Expo App Loading & Fonts
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

// Theme & Config
import { getTheme, lightTheme } from './src/theme';

// Services
import { notificationService } from './src/services/notifications/notificationService';
import { notificationHandlers } from './src/services/notifications/notificationHandlers';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some error */
});

// A temporary pretty placeholder until we build the real RootNavigator in Layer 14
const MockNavigator = () => (
  <View style={styles.mockContainer}>
    <Ionicons name="shield-checkmark" size={64} color={lightTheme.colors.primary} />
    <Text style={styles.mockTitle}>Nivara</Text>
    <Text style={styles.mockSubtitle}>Safety & Caregiver Core</Text>

    <View style={styles.mockBox}>
      <Text style={styles.mockText}>App is successfully bootstrapped! ✅</Text>
      <Text style={styles.mockText}>• Native Services Initialized</Text>
      <Text style={styles.mockText}>• Push Listeners Active</Text>
      <Text style={styles.mockText}>• Fonts Loaded</Text>
      <Text style={[styles.mockText, { marginTop: 12, fontWeight: 'bold' }]}>
        Waiting for RootNavigator.jsx...
      </Text>
    </View>
  </View>
);

export default function App() {
  const navigationRef = useRef();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // 1. Pre-load fonts (Ionicons are required, you can add custom fonts like Inter here later)
        await Font.loadAsync({
          ...Ionicons.font,
          // 'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'), // Example
        });

        // 2. Initialize Notification Channels (Android) & Push Tokens
        await notificationService.init();

      } catch (e) {
        console.warn('App Bootstrap Error:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepareApp();
  }, []);

  // Setup Notification Listeners once the app is ready and NavContainer is mounted
  useEffect(() => {
    if (!appIsReady) return;

    let cleanupNotificationListeners = null;

    // Slight delay ensures the Navigation Ref is fully hydrated before deep-linking is allowed
    const timeout = setTimeout(() => {
      if (navigationRef.current) {
        cleanupNotificationListeners = notificationHandlers.setupListeners(navigationRef.current);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (cleanupNotificationListeners) {
        cleanupNotificationListeners();
      }
    };
  }, [appIsReady]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the splash screen only exactly when we are ready to render the first frame
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // The Native Splash screen remains visible while this returns null
  }

  const currentTheme = getTheme(false);

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <StatusBar style="dark" />

        <NavigationContainer
          ref={navigationRef}
          theme={{
            dark: false,
            colors: {
              background: currentTheme.colors.background,
              card: currentTheme.colors.surface,
              text: currentTheme.colors.text.primary,
              border: currentTheme.colors.border,
              primary: currentTheme.colors.primary,
              notification: currentTheme.colors.status.emergency,
            }
          }}
        >
          {/* REPLACE ME IN LAYER 14 */}
          <MockNavigator />
        </NavigationContainer>

      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.background,
    padding: 24,
  },
  mockTitle: {
    ...lightTheme.typography.h1,
    color: lightTheme.colors.primary,
    marginTop: 16,
  },
  mockSubtitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text.secondary,
    marginBottom: 32,
  },
  mockBox: {
    backgroundColor: lightTheme.colors.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    ...lightTheme.shadows.md,
    width: '100%',
  },
  mockText: {
    ...lightTheme.typography.body1,
    color: lightTheme.colors.text.primary,
    marginBottom: 8,
  }
});
