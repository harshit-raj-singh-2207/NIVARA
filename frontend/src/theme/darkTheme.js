import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

/**
 * Dark theme variant.
 * Same token structure as lightTheme so components can swap seamlessly.
 */

const darkColors = {
  primary: '#2dd4bf',       // Brighter teal for dark backgrounds
  primaryLight: '#0d3d38',  // Muted teal surface
  primaryDark: '#5eead4',   // Light teal for text on dark

  background: '#0f172a',    // Deep navy
  surface: '#1e293b',       // Slate card surface

  text: {
    primary: '#f1f5f9',     // Near-white
    secondary: '#94a3b8',   // Muted slate
    inverse: '#0f172a',     // Dark text on light buttons
  },

  status: {
    safe: '#34d399',        // Bright green
    safeBg: '#064e3b',      // Deep green surface
    warning: '#fbbf24',     // Bright amber
    warningBg: '#78350f',   // Deep amber surface
    emergency: '#f87171',   // Bright red
    emergencyBg: '#7f1d1d', // Deep red surface
  },

  border: '#334155',        // Slate border
  transparent: 'transparent',
};

export const darkTheme = {
  colors: darkColors,
  typography: typography,
  spacing: spacing,
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
  },
};
