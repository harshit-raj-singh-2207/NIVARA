/**
 * Dark / Sensory Calm Theme Object for NIVARA.
 * Configured with PALETTE and THEME.sensoryCalm design tokens.
 */

import { BRAND_COLORS, PALETTE, SENSORY_PALETTES, STATUS_COLORS, THEME } from '../constants/colors';
import { BORDER_RADIUS, SPACING } from '../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';

export const darkTheme = {
  mode: 'dark',
  colors: {
    ...BRAND_COLORS,
    ...SENSORY_PALETTES.dark,
    ...THEME.sensoryCalm,
    primary: THEME.sensoryCalm.primary,
    primaryLight: '#E3CFD7',
    primaryDark: '#6D4C5B',
    background: THEME.sensoryCalm.background,
    surface: THEME.sensoryCalm.surface,
    text: THEME.sensoryCalm.text,
    textSecondary: THEME.sensoryCalm.subtext,
    border: THEME.sensoryCalm.border,
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
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 10,
    },
  },
};

export default darkTheme;
