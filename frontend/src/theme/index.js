/**
 * NIVARA Dynamic Theme Engine & Provider Context.
 * Manages active theme mode (light, dark, sensoryCalm, high_contrast) and dynamic typography scaling.
 */

import React, { createContext, useContext, useMemo, useState } from 'react';
import { getScaledTypography } from '../constants/typography';
import { darkTheme } from './darkTheme';
import { highContrastTheme } from './highContrastTheme';
import { lightTheme } from './lightTheme';

const ThemeContext = createContext({
  theme: lightTheme,
  themeMode: 'light',
  setThemeMode: () => {},
  toggleThemeMode: () => {},
  fontScale: 1.0,
  setFontScale: () => {},
});

export const ThemeProvider = ({ children, initialMode = 'light', initialFontScale = 1.0 }) => {
  const [themeMode, setThemeMode] = useState(initialMode);
  const [fontScale, setFontScale] = useState(initialFontScale);

  const toggleThemeMode = () => {
    setThemeMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'high_contrast';
      return 'light';
    });
  };

  const activeTheme = useMemo(() => {
    let baseTheme = lightTheme;
    if (themeMode === 'dark' || themeMode === 'sensoryCalm') {
      baseTheme = darkTheme;
    } else if (themeMode === 'high_contrast') {
      baseTheme = highContrastTheme;
    }

    const scaledTypography = getScaledTypography(fontScale);

    return {
      ...baseTheme,
      typography: scaledTypography,
    };
  }, [themeMode, fontScale]);

  const value = useMemo(
    () => ({
      theme: activeTheme,
      themeMode,
      setThemeMode,
      toggleThemeMode,
      fontScale,
      setFontScale,
    }),
    [activeTheme, themeMode, fontScale]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
