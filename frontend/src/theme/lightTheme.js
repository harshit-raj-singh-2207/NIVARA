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
      shadowColor: '#6D5B62',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 1,
    },
    medium: {
      shadowColor: '#6D5B62',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 3,
    },
    large: {
      shadowColor: '#6D5B62',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export default lightTheme;
