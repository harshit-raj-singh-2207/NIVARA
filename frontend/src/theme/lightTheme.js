<<<<<<< HEAD
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

export const lightTheme = {
  colors: colors,
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
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    }
  }
};
=======
/**
 * Light Theme Object for NIVARA.
 * Configured with PALETTE and THEME.light design tokens.
 */

import { BRAND_COLORS, PALETTE, SENSORY_PALETTES, STATUS_COLORS, THEME } from '../constants/colors';
import { BORDER_RADIUS, SPACING } from '../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';

export const lightTheme = {
  mode: 'light',
  colors: {
    ...BRAND_COLORS,
    ...SENSORY_PALETTES.light,
    ...THEME.light,
    primary: THEME.light.primary,
    primaryLight: PALETTE.primary[100],
    primaryDark: PALETTE.primary[900],
    background: THEME.light.background,
    surface: THEME.light.surface,
    text: THEME.light.text,
    textSecondary: THEME.light.subtext,
    border: THEME.light.border,
    status: STATUS_COLORS,
    palette: PALETTE,
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  typography: {
    sizes: FONT_SIZES,
    weights: FONT_WEIGHTS,
  },
  shadows: {
    small: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export default lightTheme;
>>>>>>> e7aded7bdfe7c0dc94f52e15f9e5062d81aba6f3
