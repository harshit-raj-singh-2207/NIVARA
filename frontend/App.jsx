import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';

function AppRoot() {
  const { theme, themeMode } = useTheme();
  const { colors } = theme;

  return (
    <>
      <StatusBar
        barStyle={themeMode === 'dark' || themeMode === 'high_contrast' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRoot />
    </ThemeProvider>
  );
}
